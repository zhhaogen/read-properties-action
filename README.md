# Read Properties Action
读取properties文件并输出为变量

## 输入
|名称|类型|是否必须|默认值|描述|
|-|-|-|-|-|
|file|String|是|undefined|properties文件位置|
|prefix|String|否|""|输出变量的前缀|

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
  delete:
    runs-on: ubuntu-latest
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
      - name: 读取Properties变量
        uses: zhhaogen/read-properties-action@v1.0
        with:
          file: resources/application.properties
      - name: 打印Properties变量
        run: echo ${{ server.port }}

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
with:
    file: resources/application.properties
    prefix: current
- name: 打印Properties变量
run: echo ${{ current.server.port }}

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
```
- name: 读取Properties变量1
uses: zhhaogen/read-properties-action@v1.0
with:
    file: resources/application.properties
    prefix: current
- name: 读取Properties变量2
uses: zhhaogen/read-properties-action@v1.0
with:
    file: resources/application-test.properties
    prefix: test
- name: 打印Properties变量
run: echo ${{ current.server.port }},${{ test.server.port }}
```
期望输出结果
```
8080,9090
```