/**************************************************************************************************
    File Name   : apiController.ts

    Description :
        BG Programming test user postgresql query module

    Update History :
        2022.06     BGKim       Create
**************************************************************************************************/

import {define} from "@stdlib";
import { api } from "@libs/api";


module.exports.route = function(app : any)
{
	app.get( '/api/check-version',  function (request:any, response:any) {
		"use strict";
		require(`../libs/utils.js` ).responseMessage(response, { "version" : define.VERSION } );
	});

	api.init(app);
	const params = {app, api};

	require('./userController.js' ).route(params);
};
