import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import { MailerGatewayConsole } from "../../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(async () => {
	connection = new PgPromiseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const accountRepository = new AccountRepositoryDatabase(connection);
	signup = new Signup(accountRepository, new MailerGatewayConsole());
	requestRide = new RequestRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository, accountRepository);
})

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.date).toBeDefined();
});

afterEach(async () => {
	await connection.close();
})