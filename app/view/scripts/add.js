function validate(){
    let valid = true;
    if($('#name').val()){
        valid = false;
        document.getElementById('name').style.backgroundColor = 'pink';
        clearChildren(document.getElementById('nameError'));
        document.getElementById('nameError').style.color = 'red';
        document.getElementById('nameError').appendChild(document.createTextNode('*Please Enter a Folder Name'));
        document.getElementById('nameError').style.display = 'block';
    }
    return valid;
}
function showPermissions(id){
    const userDiv = document.getElementById(id);
    if(containsSelect(userDiv)){
        userDiv.removeChild(userDiv.childNodes[5]);
        return;
    }
    console.log(userDiv);
    const selectBox = document.createElement('select');
    selectBox.name = id;
    selectBox.appendChild(createOption('read','Read Only'));
    selectBox.appendChild(createOption('write','Read/Upload'));
    userDiv.appendChild(selectBox);
}
function clearChildren(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
function createOption(value,text){
    const option = document.createElement('option');
    option.value=value;
    option.append(document.createTextNode(text));
    return option;
}
function containsSelect(div){
    let contains = false;
    for(let i = 0; i < div.children.length; i++){
        if(div.children[i].nodeName === 'SELECT'){
            contains = true;
        }
    }
    return contains;
}
function checkInput(element){
    document.getElementById('err').style.visibility ="hidden";
    element.style.backgroundColor = "";
}
