function addtocart(){
    //console.log(playerObj.getConfigurator('panelName').metadata);
    finalObj.metadata=playerObj.getConfigurator('panelName').metadata;   
    console.log(finalObj);
}
function setBorder(colorVal)
{
    var borderAssetID;
    finalObj.border = colorVal;

    if (colorVal==='Black'){
    borderAssetID="63ccea68-4d3b-4637-9fca-962147956e89";
    }
    else if (colorVal==='Grey'){
    borderAssetID="43b9d81e-1d81-4b67-9b7b-83737fcbcc53";
    }
    else if (colorVal==='White'){
    borderAssetID="1f779f81-c495-4c40-b186-9b82aedc2a7a";
    }
    else if (colorVal==='Mirror'){
    borderAssetID="efdd80a1-6e0e-4a5e-9666-7352769432a3";
   
    }
    else {
    borderAssetID="35baefef-b860-434a-a1e3-4a8569507149"; //blur
    
    }
    configurator.setConfiguration({"Border" : {assetId :borderAssetID}}); 
}

function changeImage(imageValue) {

        configuratorobj.setConfiguration({
            'sourceImage': {
                assetId: imageValue
            }
        });

    }
    
async function getMaterialConfigurator() {
        const panelid = playerObj.configurator.appliedConfiguration["panelName"]
        var assetInstance = await playerObj.getAssetInstance({
            id: panelid,
            plug: "Proxy",
            property: "asset"
        })
        configuratorobj = await playerObj.getConfiguratorInstance({
            from: api.scene.findNode({
                from: assetInstance,
                name: selectNodeName
            }),
            name: 'FrontFace',
            plug: 'Material',
            property: 'reference'
        })
    }
    
function addToolToScene() {

    finalObj.border = 'Blur';//default value is Blur 
    //console.log("hello");
    
        api.tools.addTool({
                key: 'CanvasPrint',
                label: 'Select',
                active: true,
                enabled: true,
                handlers: {

                    mousedown: e => {
                        //when nothing is selected 
                        api.selectionSet.clear(); // clear the selection
                        configuratorobj=null; //remove the config Object
                        selectNodeName=""; //remove the Selected node
                        
                        const hits = e.hitNodes;
                        if (!hits.length) return;

                        var id = hits.length - 1;
                        var selectMeshID;
                        var selectCanvasName;
                        var selectCanvasID;
                        const hierarchy = [...hits[id].hierarchy];
                        hierarchy.reverse();

                        var canvas = hierarchy.find(el => el.type === "Null");
                        var panel = hierarchy.find(el => el.type === "PolyMesh" && el.name === "FrontFace");

                        if (panel) {
                            api.selectionSet.add(panel.nodeId);
                            selectNodeName = canvas.name;
                            //console.log(selectNodeName);
                            if (!finalObj[selectNodeName])
                                finalObj[selectNodeName] = {}; //creating object
                            //console.log(finalObj);
                            //node.setStyle({ outlineColor: '#00ff00', outlineThinkness: 5, color: '#ff0000', opacity: 0.5 });
                            getMaterialConfigurator().then();
                        }

                    }, //end of mouse event


                }, //end of handelers
            } //end fo add tool

        );

    } //end of function 

function movefourdirection(direction) {
    if(configuratorobj===null)
        return;
        var verticalPos = configuratorobj.appliedConfiguration["canvas_vertical_global"];
        var horizontalPos = configuratorobj.appliedConfiguration["canvas_horizontal_global"];

        if (direction == 'Right') {
            horizontalPos = horizontalPos + 20;
        }

        if (direction == 'Left') {
            horizontalPos = horizontalPos - 20;
        }

        if (direction == 'Down') {
            verticalPos = verticalPos + 20;
        }

        if (direction == 'Up') {
            verticalPos = verticalPos - 20;
        }
        finalObj[selectNodeName].verticalPos = verticalPos;
        finalObj[selectNodeName].horizontalPos = horizontalPos;

        configuratorobj.setConfiguration({
            "canvas_vertical_global": verticalPos,
            "canvas_horizontal_global": horizontalPos
        })

    }

    function rotateimage() {
if(configuratorobj===null)
        return;
        var rotate = configuratorobj.appliedConfiguration["canvas_rotation_global"];
        rotate = rotate + 5;
        finalObj[selectNodeName].rotate = rotate;
        configuratorobj.setConfiguration({
            "canvas_rotation_global": rotate
        })

    }

    function blacknwhiteimage() {
        if(configuratorobj===null)
        return;

        var bw = configuratorobj.appliedConfiguration["blackwhite_global"];
        //default false
        if (bw == false) {
            configuratorobj.setConfiguration({
                "blackwhite_global": true
            })
            finalObj[selectNodeName].blacknwhite = true;

        } else {
            configuratorobj.setConfiguration({
                "blackwhite_global": false
            })
            finalObj[selectNodeName].blacknwhite = false;

        }
    }


    function zoominoutimage(scale) {
        if(configuratorobj===null)
        return;

        var height = configuratorobj.appliedConfiguration["canvas_height_global"];
        var width = configuratorobj.appliedConfiguration["canvas_width_global"];

        if (scale == 'Plus') {
            height = height + .1;
            width = width + .1;
        }

        if (scale == 'Minus') {
            height = height - .1;
            width = width - .1;
        }
        finalObj[selectNodeName].height = height;
        finalObj[selectNodeName].width = width;

        configuratorobj.setConfiguration({
            "canvas_height_global": height,
            "canvas_width_global": width
        })

    }
    function getAssetIDforVariant(variantid)
    {
    const mapWD = new Map();

    




        //tripytch models

        mapWD.set('32365183828055', "f1633cfa-f462-49f1-9793-b484a5f80f3a");//Classic Triptych
        mapWD.set('32366536327255', "bd7167ba-af06-4ea3-82ed-8577f50f13a7");//Classic Flow Triptych
        mapWD.set('32365179535447', "93faf5a0-098b-4409-95dd-072dbe2ca3ca");//Cozy Triptych
        mapWD.set('32366542258263', "727fc1b0-75cf-43e2-9089-535eb9aae8de");//Cozy Flow Triptych
        
        
        return mapWD.get(variantid);

    }