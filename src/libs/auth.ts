/**************************************************************************************************
	File Name	: auth.ts
	Description
	  Singleton class for authrity

	Update History
      2022.06            BGKim       Create
**************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  Required Modules                                             //
///////////////////////////////////////////////////////////////////////////////////////////////////
import { v4 as uuidv4 } from 'uuid';


///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  	Auth Class                                     			 //
///////////////////////////////////////////////////////////////////////////////////////////////////

interface AuthData{
	lastAccessTime : number;
	userInfo : any;
}

class Auth {

	/*
	// Security token 으로 접속한 사용자 인증을 유지하여 사용자 확인의 부하를 줄인다.
	// Key : security token
	// value :
		{
			lastAccessTime 	: date ( ms, UTC ),
			...user infos
		}
	*/
	tableSecurityToken = new Map<string, AuthData>();


	// 사용자 인증 만료 알고리즘
	// 사용자 만료의 작업은 주기적으로 작업을 한다.
	// 즉, 호출 시 마다 작업하는 것이 아니라 사용자 인증 만료 작업을 한 마지막 시간을 기준으로 만료 기간을 체크한다.

	// 마지막에 인증 만료를 검색한 시간
	miliSecondLastExpireCheckTime = 0;


	// 인증 만료 체크 주기
	miliSecondExpireCheckPeriod =  60 * 60 * 1000;

	// Security key 인증 만료 시간
	miliSecondExpireTime = 7 * 24 * 60 * 60 * 1000;

	private getExpireTime(securityToken : string) {
		let authData  = this.tableSecurityToken.get(securityToken);
		let lastAccessTime = authData ? authData.lastAccessTime : 0;
		return lastAccessTime + this.miliSecondLastExpireCheckTime;
	}

	private _checkExpireTime() {
		let now = Date.now();
		if(  now - this.miliSecondLastExpireCheckTime < this.miliSecondExpireCheckPeriod )
			return ;

		this.miliSecondLastExpireCheckTime = now;
		for ( let securityToken in this.tableSecurityToken  ) {
			let authData  = this.tableSecurityToken.get(securityToken);
			let lastAccessTime = authData ? authData.lastAccessTime : 0;
			if( this.miliSecondExpireTime < now - lastAccessTime  )
				this._deleteSecurityToken( securityToken  );
		}
	}

	private _deleteSecurityToken( securityToken : string  ) {
		this.tableSecurityToken.delete(securityToken);
	}

	private _containToken( securityToken : string ) {
		return securityToken in this.tableSecurityToken;
	};


	private _insertSecurityTokenTable ( securityToken : string, userInfo : any ) {
		this.tableSecurityToken.set(securityToken, {
			lastAccessTime : Date.now(),
			userInfo
		});
	}


	public getSecurityToken( propertyName : string, id : string | number ) : string | null {
		this._checkExpireTime();
		this.tableSecurityToken.forEach((authData : AuthData, securityToken : string)=>{
			if( authData.userInfo[propertyName] === id ) {
				authData.lastAccessTime = Date.now();
				console.log("return exists token");
				return securityToken;
			}
		});

		return null;
	}

	// 사용자 정보를 메모리에 올리고 토큰을 발급한다.
	public insertSecurityToken( userInfo : any ) : string {
		const securityToken = uuidv4();
		this._insertSecurityTokenTable( securityToken, userInfo );
		return securityToken;
	}

	// _utils 함수에서 헤더에서 전송받은 security token 이 유효한지 확인하는데 사용
	public isValidSecurityToken( securityToken : string ){
		this._checkExpireTime();
		return this.tableSecurityToken.get(securityToken) !== undefined;
	}


	public getUserInfo( securityToken : string ) : any | null {
		"use strict";
		this._checkExpireTime();
		// Security token을 사용하면 마지막 접근 시간을 갱신한다
		let authData = this.tableSecurityToken.get(securityToken);
		if( authData ) {
			authData.lastAccessTime = Date.now();
			return authData.userInfo;
		}
		else
			return null;
	};


	public getUserInfoWithSecurityToken( securityToken : string ) : any {
		return this.getUserInfo(securityToken);
	};
}





///////////////////////////////////////////////////////////////////////////////////////////////////
//                                  Module Exports					                             //
///////////////////////////////////////////////////////////////////////////////////////////////////
const _auth = new Auth();
export default _auth;
