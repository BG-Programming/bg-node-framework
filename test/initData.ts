import TestCampaign from "./campaign/TestCampaign";
import TestAdmin from "./TestAdmin";
import TestChatting from "./TestChatting";


async function  main() {    
    
    // Create Campaigns
    console.log("============== Create Campaigns");
    await TestCampaign.instance.test("createCampaign", {user : "bg"});    
    
    // Review Campaigns
    console.log("==============  Review Campaigns");    
    await TestAdmin.instance.test("reviewCampaign", {campaignId : 1});        
    await TestAdmin.instance.test("reviewCampaign", {campaignId : 2});
    await TestAdmin.instance.test("reviewCampaign", {campaignId : 3});
    await TestAdmin.instance.test("reviewCampaign", {campaignId : 4});
    await TestAdmin.instance.test("reviewCampaign", {campaignId : 5});
    

    // Apply Campaigns
    console.log("==============  Apply Campaigns");    
    await TestCampaign.instance.test("applyCampaignWithMCN", {campaignId : 1, applicantType : "mcn", applicantSdeId : 9});
    await TestCampaign.instance.test("applyCampaignWithMCN", {campaignId : 2, applicantType : "mcn", applicantSdeId : 9});
    await TestCampaign.instance.test("applyCampaignWithMCN", {campaignId : 3, applicantType : "mcn", applicantSdeId : 9});
    

    // Pass Review
    console.log("============== Pass Review");
    await TestCampaign.instance.test("passReview", {user : "bg", campaignId : 1, applicationId : 1});    
    await TestCampaign.instance.test("passReview", {user : "bg", campaignId : 2, applicationId : 2,
        passApplicationChannels : [4]
    });
    await TestCampaign.instance.test("passReview", {user : "bg", campaignId : 3, applicationId : 3});

    
    // Create Chatting Room
    console.log("============== Create Chatting Room");    
    await TestChatting.instance.test("createCampaignRoom", {user : "mcn", campaignId : 3, applicationId : 3});
    
    // Pass Channel and contents
    console.log("============== Pass channel and contents");
    await TestCampaign.instance.test("passApplicationChannel", {user : "bg", campaignId : 3, applicationId : 3, applicationChannelId : 5});
    await TestCampaign.instance.test("passApplicationChannel", {user : "bg", campaignId : 3, applicationId : 3, applicationChannelId : 6});
    await TestCampaign.instance.test("updateApplicationChannelContents", {user : "mcn", campaignId : 3, applicationId : 3, channelId : 5, contentsId:2, draftDeliveryDate : 1652697595, expectedUploadDate : 1653697595 });
    await TestCampaign.instance.test("updateApplicationChannelContents", {user : "mcn", campaignId : 3, applicationId : 3, channelId : 6, contentsId:3, draftDeliveryDate : 1652697595, expectedUploadDate : 1653697595 });
    await TestCampaign.instance.test("passCampaignApplicationContents", {user:"bg", campaignId : 3, applicationId :3, channelId : 5, contentsId:2 });
    await TestCampaign.instance.test("passCampaignApplicationContents", {user:"bg", campaignId : 3, applicationId :3, channelId : 6, contentsId:3 });
          
    // Contract 
    await TestCampaign.instance.test("createOfflineContract", {user : "mcn", campaignId : 3, applicationId : 3});
    await TestCampaign.instance.test("approveContract", {user : "bg", campaignId : 3, applicationId : 3, contractId : 1});


    await TestAdmin.instance.test("insertCampaignApplicationDeposit", {user:"admin", 
            campaignId : 3, applicationId : 3, depositId : 1,
            depositorName : "삼송전자", bankName : "너그은행", bankAccount : "123-7777-38113", 
            depositAmount : 13000840000,
            currency : "KRW", 
            depositTime : Math.floor( Date.now()/1000 )
    });

    /*
    // sign mcn - influencer
    await TestCampaign.instance.test("signCampaignApplicationChannelContract", {user : "mcn", campaignId : 3, applicationId:3, channelId:5, contractId:1,
            params : {
                amount : 5000000,
                deliveryCount : 1,
                maintenanceDurationMonth : 12,
                startTime : 1653297865,
                endTime : 1653307865,
                contractFileId : 1,
                etc : "기타 요구사항. 블라블라~",
                contents : [{
                    contentsId : 2,
                    pseudoTitle : "#매우 재미있는 콘텐츠 1",
                    mandatoryRequest : "내게 무슨 마음의 병 있는 것 처럼~",
                    amount : 4000000,
                    currency : "KRW",
                    draftDeliveryDate : 1653297865,
                    expectedUploadDate : 1653297865,
                    settlementDateBase : "upload-date",
                    settlementLimitDays : 60,
                    secondLicences : [{
                        licence : "edit",
                        amount : "500000",
                        currency : "KRW",
                        periodMonth : 3
                    }, {
                        licence : "advertise",
                        amount : "500000",
                        currency : "KRW",
                        periodMonth : 3
                    }]
                }],
            }       
    });

    
    // inspection
    await TestCampaign.instance.test("submitInspection", {user : "mcn", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, count : 1, url : "https://www.youtube.com/watch?v=zx_2apQM-D4"});
    await TestCampaign.instance.test("decideInspection", {user : "bg", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, count : 1, decision : "reject"});
    await TestCampaign.instance.test("submitInspection", {user : "mcn", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, count : 2, url : "https://www.youtube.com/watch?v=zx_2apQM-D4"});    
    await TestCampaign.instance.test("decideInspection", {user : "bg", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, count : 2, decision : "accept"});
    await TestCampaign.instance.test("submitFinalContent", {user : "mcn",  campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, url : "https://www.youtube.com/watch?v=zx_2apQM-D4" });
    await TestCampaign.instance.test("updateFinalContent", {user : "mcn",  campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, url : "https://www.youtube.com/watch?v=zx_2apQM-D4" });       
    await TestCampaign.instance.test("startContentsReport", {user : "mcn", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2 });    
    
    
    await TestCampaign.instance.test("decideFinalContent", {user : "bg", campaignId : 3, applicationId : 3, channelId : 5, contentsId : 2, decision : "accept"});
    
    /*
    await TestAdmin.instance.test("confirmCampaignApplicationSettlement", {
            user:"admin",
            campaignId : 3,
            applicationId : 3, 
            channelId : 5,
            contentsId : 2,
            settlementId : 1,
            paymentTime : Math.floor( Date.now()/1000 )
    });
    // console.log("==============  Init  Completed ===========================");
    */
}



(async ()=>{
    await main();
})();