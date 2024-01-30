import { AccountRepositoryDatabase } from "../repository/AccountRepository";
import { PgPromiseAdapter } from "../database/DatabaseConnection";
import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import HttpServer from "./HttpServer";
import { MailerGatewayConsole } from "../gateway/MailerGateway";
import RequestRide from "../../application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../repository/RideRepository";
import Signup from "../../application/usecase/Signup";

// Interface Adapter (verde)
export default class MainController {

	constructor (httpServer: HttpServer, signup: Signup, getAccount: GetAccount, requestRide: RequestRide, getRide: GetRide) {
		httpServer.register("post", "/signup", async function (params: any, body: any) {
			const output = await signup.execute(body);
			return output;
		});
		
		httpServer.register("get", "/accounts/:accountId", async function (params: any, body: any) {
			const output = await getAccount.execute(params.accountId);
			return output;
		});
		
		httpServer.register("post", "/request_ride", async function (params: any, body: any) {
			const output = await requestRide.execute(body);
			return output;
		});
		
		httpServer.register("get", "/rides/:rideId", async function (params: any, body: any) {
			const ride = await getRide.execute(params.rideId);
			return ride;
		});
	}
}