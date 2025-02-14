export function getFileSize(fileSizeInBytes){
          if(!fileSizeInBytes) return "";
          var unitList=["Bytes","KB","MB","GB"];
          for(let i=unitList.length-1; i>=0; i--){
                    var baseUnitNum=Math.pow(2, 10*i);
                    if(fileSizeInBytes>baseUnitNum)
                              return `${fileSizeInBytes/baseUnitNum} ${unitList[i]}`;   
          }
}