// https://www.keicode.com/script/scr05.php
// https://techacademy.jp/magazine/20820 参考
function addTable() {
  var child = document.createElement("table");
  addChild(child, "table");
}
function addTr() {
  var child = document.createElement("tr");
  addChild(child, "tr");
}
function addTh() {
  var child = document.createElement("th");
  addChild(child, "th");
}
function addTd() {
  var child = document.createElement("td");
  addChild(child, "td");
}
function addChild(child, tag) {
  var parent = document.getElementById("parent");
  var id = 0;
  child.id = "scoreTable-" + tag + id.toString();
  child.innerText = "テスト";
  id++;
  parent.appendChild(child);
}
