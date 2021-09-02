async function uploadImage(filedata)
{
	//This method returns the fileID and AssetID
	$("#uiOverlay").dialog({
	modal: true,
	closeOnEscape: false,
	dialogClass: "dialog-no-close",
	}) 
	var jobID= await uploadFileToThreeKit(filedata);
	var objAsset=await getAssetIDfromJob(jobID);
while(objAsset?.job_status!= "stopped")	
{
	objAsset=await getAssetIDfromJob(jobID); 
	await sleep(3000); 
}//end of while
$("#uiOverlay").dialog("close");
finalObj[selectNodeName].fileID = objAsset.imagefileId;
finalObj[selectNodeName].assetId = objAsset.imageassetId;
return objAsset; 
}

async function uploadFileToThreeKit(filedata) {

    var myHeaders = new Headers(); //post 
    var jobIdGlobal;
    var formdata = new FormData();
    formdata.append("orgId", orgID);
    formdata.append("files", filedata);

    var requestOptionsUpload = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

   

    await fetch("https://preview.threekit.com/api/catalog/assets/upload?bearer_token=" + authToken, requestOptionsUpload)
        .then(response => response.json())
        .then((result) => {
                //						
                jobIdGlobal = result[0].jobId;
                
               
				
            } //end of then result
        )

    .catch(error => console.log('error', error));
	
return jobIdGlobal;
 }
//This function will return fileID and assetId.
async function  getAssetIDfromJob(jobID)
{
	 var myHeadersAsset = new Headers(); //get
	 var imageassetId;
	 var imagefileId;
	 var job_status;
	 var requestOptionsAsset = {
        method: 'GET',
        headers: myHeadersAsset,
        redirect: 'follow'
    };
	
	await fetch("https://preview.threekit.com/api/catalog/jobs/" + jobID + "?bearer_token=" + authToken + "&orgId" + orgID, requestOptionsAsset)
                        .then(responseAsset => responseAsset.json())
                        .then((resultAsset) => {
                                job_status = resultAsset.job.status;
                                if (job_status === "stopped") {
                                  								
                                    imageassetId = resultAsset?.output?.texture[0]?.assetId;
									imagefileId = resultAsset?.job?.parameters?.fileId;
							
                                }
                            } //end then resultAsset
                        ) //end then resultAsset
                        .catch(error => console.log('error', error));
						return {job_status,imageassetId, imagefileId};
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}