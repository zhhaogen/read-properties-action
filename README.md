# Read Properties Action
读取properties文件并输出为变量

## 输入
|名称|类型|是否必须|默认值|描述|
|-|-|-|-|-|
|file|String|否|undefined|properties文件位置,多行文本|
|prefix|String|否|""|输出变量的前缀,多行文本,数量应该与file数量一致|
|configJson|String|否|undefined|配置json|


## 例子
### 最简单的
`resources/application.properties`内容如下
```
server.port=8080
```
`test.yml`文件
```
name: Read Properties
run-name: 读取打印properties文件变量
on:
  - workflow_dispatch
permissions:
  contents: read
jobs:
  dump:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      - name: 读取Properties变量
        id: readps
        uses: zhhaogen/read-properties-action@v1.0
        with:
          file: resources/application.properties
      - name: 打印Properties变量
        run: echo ${{ steps.readps.outputs.server.port }}

```
期望输出结果
```
8080
```
### 使用前缀

`test.yml`文件
```
- name: 读取Properties变量
uses: zhhaogen/read-properties-action@v1.0
id: readps
with:
    file: resources/application.properties
    prefix: current_
- name: 打印Properties变量
run: echo ${{ steps.readps.outputs.current_server.port }}

```
期望输出结果
```
8080
```

### 使用多个文件

`resources/application-test.properties`内容如下
```
server.port=9090
```
`test.yml`文件
```
- name: 读取Properties变量
uses: zhhaogen/read-properties-action@v1.0
id: readps
with:
    file: |-
    resources/application.properties
    resources/application-test.properties
    prefix: |-
    current_
    test_
- name: 打印Properties变量
run: echo ${{ steps.readps.outputs.current_server.port }},${{ steps.readps.outputs.test_server.port }}
```
期望输出结果
```
8080,9090
```

### 使用configJson
`configJson`实际值为
```
[
  {'file':'resources/application.properties','prefix':'current_'},
  {'file':'resources/application-test.properties','prefix':'test_'}
]
```
转为json字符串
```
[{"file":"resources/application.properties","prefix":"current_"},{"file":"resources/application-test.properties","prefix":"test_"}]
```

`test.yml`文件
```
- name: 读取Properties变量
uses: zhhaogen/read-properties-action@v1.0
id: readps
with:
    configJson: '[{"file":"resources/application.properties","prefix":"current_"},{"file":"resources/application-test.properties","prefix":"test_"}]'
- name: 打印Properties变量
run: echo ${{ steps.readps.outputs.current_server.port }},${{ steps.readps.outputs.test_server.port }}
```
期望输出结果
```
8080,9090
```