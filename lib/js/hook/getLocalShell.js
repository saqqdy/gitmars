const hookComment=require("./getHookComment")();function getLocalShell(pmName,relativeUserPkgDir){return`${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`}module.exports=getLocalShell;