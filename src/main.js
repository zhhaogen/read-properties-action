const core = require("@actions/core");
const { Properties } = require("properties-file");
const fs = require("node:fs");
try {
    let filePath = core.getInput("file");
    let prefix = core.getInput("prefix");
    console.log("读取文件", filePath);
    if (!fs.existsSync(filePath)) {
        console.log("文件不存在");
        return;
    }
    if (prefix == null) {
        prefix = "";
    }
    let content = fs.readFileSync(filePath, { encoding: "utf8" });
    let ps = new Properties(content);
    if (ps.collection.length == 0) {
        return;
    }
    for (let keyValue of ps.collection) { 
        core.setOutput(prefix+keyValue.key, keyValue.value); 
    }
} catch (error) {
    core.setFailed(error.message);
}