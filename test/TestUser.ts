import TestModule from "./TestModule";
import {LoginInfo} from "./testTypes";

export default class TestUser extends TestModule{    
    static instance : TestUser = new TestUser();
    async testAll() {        
        await TestUser.instance.test("getBadge", {email:"bg.kim@loudlym.com", password : "1243"});
        await TestUser.instance.test("getBadge", {email:"gamenut@treasurehunter.co.kr"});
        await TestUser.instance.test("getBadge", {email:"jinjongsuk@treasurehunter.co.kr"});
        await TestUser.instance.test("login", {email:"bg.kim@loudlym.com", badgeId : 2});
        await TestUser.instance.test("login", {email:"bg.kim@loudlym.com", badgeId : 9});
        await TestUser.instance.test("login", {email:"jinjongsuk@treasurehunter.co.kr", badgeId : 12});

        await TestUser.instance.test("resetPassword", {email:"bg.kim@loudlym.com", oldPassword : "bgbg", newPassword : "1234", badgeId : 2});

        // Email Authorization
        await TestUser.instance.test("requestUserEmailAuthorization", {user : "bg", email:"bg.kim@loudlym.com", authModule : 'company-staff'});
        await TestUser.instance.test("tryConfirmUserEmailAuthorization", {user : "bg", authId : 1, authCode : "1234", authModule : 'company-staff'});

        await TestUser.instance.test("requestPhoneNumberAuthorization", {user : "bg", phoneNumber:"01030998741", authModule : 'company-staff'});
        await TestUser.instance.test("tryConfirmPhoneNumberAuthorization", {user : "bg", authId : 1, authNumber : "772137", authModule : 'company-staff'});

        // Email Signup
        await TestUser.instance.test("requestEmailSignup", {email:"embc32@naver.com"});
        await TestUser.instance.test("signupWithEmail", {password:"1243", signupKey : '794c03e0-3283-48c8-9ab7-7191acd1e356'});

        await TestUser.instance.test("getUserInfoWithToken", {token : "2da392b0-58c6-4b8c-9e7d-b1849d0e30ca"});
        await TestUser.instance.test("submitLoginKeyAndReturnBadgeInfo", {email:"embc32@naver.com", loginKey : "test-32424"});
        await TestUser.instance.test("loginWithKey", {email:"embc32@naver.com", loginKey : "test-32424", badgeId : 16});        
        // Member Display Name 
        await TestUser.instance.test("checkMemberDisplayName", {user:"bg", displayName : "ton"});
        await TestUser.instance.test("setMemberDisplayName", {user:"bgm", displayName : "bgbg"});
        // Post List
        await TestUser.instance.test("myPosts", {user:"bg", lastItemId : -1, numOfPage : 100,  sortType : "popular" });
        await TestUser.instance.test("myPosts", {user:"bg", lastItemId : -1, numOfPage : 100,  sortType : "latest" });
        await TestUser.instance.test("getAlarmList", {user:"bg", lastItemId : -1});
        await TestUser.instance.test("getCheckBadgeAlarm", {user:"bg"});    
        await TestUser.instance.test("getCheckSdeAlarm", {user:"bg"});
        await TestUser.instance.test("setAlarmCheckTime", {user:"bg"});
        // Block User
        await TestUser.instance.test("blockUser", {user:"bg", userId : 11});
        await TestUser.instance.test("unblockUser", {user:"bg", userId : 11});
        await TestUser.instance.test("getBlockUserList", {user:"bg"});
    }
    

TestCase() {
    this.register("getBadge", async ({email, password})=>{        
        this._tc.useCoffeeServer();
        await this._tc.post(`/api/user/auth/badges`,{email, password}, "");
    });
    this.register("login", async ({email, badgeId})=>{
        // this._tc.useOperationServer();
        // this._tc.useCoffeeServer();
        await this._tc.post(`/api/user/login`,{email, sns : 'flabo', badgeId, password : "1234"}, "");
    });
    this.register("resetPassword", async ({email, badgeId, oldPassword, newPassword})=>{
        const info = await this._tc.login(email, "flabo", badgeId, oldPassword);
        await this._tc.put(`/api/user/password-reset`, {oldPassword, newPassword }, info.token);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Email Authorization
    this.register("requestUserEmailAuthorization", async ({user, email, authModule})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/authorization/email/request`, {email, authModule}, info.token);
    });
    this.register("tryConfirmUserEmailAuthorization", async ({user, authId, authCode, authModule})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/authorizations/${authId}/email/confirm`, {authModule, authCode}, info.token);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Phone Number Authorization
    this.register("requestPhoneNumberAuthorization", async ({user, phoneNumber, authModule})=>{
        await this._tc.useCoffeeServer();
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/authorization/phone/request`, {phoneNumber, authModule}, info.token);
    });
    this.register("tryConfirmPhoneNumberAuthorization", async ({user, authId, authNumber, authModule})=>{
        await this._tc.useCoffeeServer();
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/authorizations/${authId}/phone/confirm`, {authModule, authNumber}, info.token);
    });


    this.register("requestEmailSignup", async ({email})=>{
        await this._tc.post(`/api/user/sign-up-with-email/reqeust`, {email}, "");
    });
    this.register("signupWithEmail", async ({password, signupKey})=>{
        await this._tc.post(`/api/user/sign-up-with-email`, {password, signupKey}, "");
    });

    this.register("getUserInfoWithToken", async ({token})=>{
        await this._tc.get(`/api/user/auth/info/${token}`,  "");
    });
    this.register("submitLoginKeyAndReturnBadgeInfo", async ({email, loginKey})=>{
        await this._tc.post(`/api/user/auth/badges-with-key`, {email, loginKey}, "");
    });
    this.register("loginWithKey", async ({email, loginKey, badgeId})=>{
        await this._tc.post(`/api/user/login-with-key`, {email, loginKey, badgeId}, "");
    });
    // member display name
    this.register("checkMemberDisplayName", async ({user, displayName})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/member/displayname/check`, {displayName}, info.token);
    });
    this.register("setMemberDisplayName", async ({user, displayName})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.put(`/api/user/member/displayname`, {displayName}, info.token);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Posts
    this.register("myPosts", async ({user, lastItemId, numOfPage, sortType})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.get(`/api/user/me/posts?lastItemId=${lastItemId}&numOfPage=${numOfPage}&sortType=${sortType}`, info.token);
    });
    this.register("getCheckBadgeAlarm", async ({user, lastItemId, numOfPage, sortType})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.get(`/api/user/alarm/check`, info.token);
    });
    this.register("getAlarmList", async ({user, lastItemId})=>{
        // this._tc.useCoffeeServer();
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.get(`/api/user/alarm?lastItemId=${lastItemId}`, info.token);
    });
    this.register("getCheckSdeAlarm", async ({user})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.get(`/api/user/alarm/sde-check`, info.token);
    });
    this.register("setAlarmCheckTime", async ({user})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/user/post-alarm/check`,{}, info.token);
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // Block
    this.register("blockUser", async ({user, userId})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.post(`/api/users/${userId}/block`, {}, info.token);
    });
    this.register("unblockUser", async ({user, userId})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.delete(`/api/users/${userId}/block`, info.token);
    });
    this.register("getBlockUserList", async ({user})=>{
        const info : LoginInfo =  await this.loginWith(user);
        await this._tc.get(`/api/user/me/blocked-user`, info.token);
    });
    this.register("firebaseSignIn", async ({snsType, email, uid})=>{        
        await this._tc.post(`/api/user/auth/badges-with-firebase`, {snsType, email, uid},"");
    });
    
}}

 

(async () => {    
    // await TestUser.instance.test("setAlarmCheckTime", {user:"bg"});
    // await TestUser.instance.test("getAlarmList", {user:"bg", lastItemId : -1});

    // await TestUser.instance.test("getBadge", {email:"jh.choi@loudlym.com", password : "12345"});
    // await TestUser.instance.test("login", {email:"jh.choi@loudlym.com", badgeId : 11});
    await TestUser.instance.test("firebaseSignIn", {snsType : "google", email : "embc3279@gmail.com", uid : "1234"});
        
    
})();
