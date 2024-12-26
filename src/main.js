const core = require("@actions/core");
const { Properties } = require("properties-file");
const fs = require("node:fs");
/**
 * @typedef ConfigItem
 * @property {string} file Properties文件路径
 * @property {string} prefix 变量前缀
 */
/**
 * 读取输入变量
 * @return {ConfigItem[]}
 */
function getConfig() {
    let configJs = core.getInput("configJson");
    if (configJs != null && configJs != "") {
        return JSON.parse(configJs);
    }
    let files = core.getMultilineInput("file");
    let prefixs = core.getMultilineInput("prefix");
    let items = [];
    if (files == null || files.length == 0) {
        return items;
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file == "") {
            continue;
        }
        let prefix;
        if (prefixs != null) {
            prefix = prefixs[i];
        }
        if (prefix == null) {
            prefix = "";
        }
        items.push({ file, prefix });
    }
    return items;
}
try {
    let items = getConfig();
    console.log("配置", items);
    let count=0;
    for (let item of items) {
        let { file: filePath, prefix } = item;
        if (!fs.existsSync(filePath)) {
            console.warn("文件不存在", filePath);
            continue;
        }
        let content = fs.readFileSync(filePath, { encoding: "utf8" });
        let ps = new Properties(content);
        if (ps.collection.length == 0) {
            continue;
        }
        for (let keyValue of ps.collection) {
            console.long(prefix + keyValue.key, keyValue.value);
            core.setOutput(prefix + keyValue.key, keyValue.value);
            count++;
        }
    } 
    console.log("总共输出"+count+"个变量");
} catch (error) {
    core.setFailed(error.message);
}