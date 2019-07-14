function setData(){

    let input = document.getElementById('input');
    console.log(input);
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);

    reader.onload = function(){
        let dataUrl = reader.result;
        document.getElementById('data').value = dataUrl.split(',')[1];
    };
}

function showPermissions(id){
    const userDiv = document.getElementById(id);

    if(containsSelect(userDiv)){
        userDiv.removeChild(userDiv.childNodes[3]);
        return;
    }
    console.log(userDiv);
    const selectBox = document.createElement('select');
    selectBox.name = id;
    selectBox.appendChild(createOption('read','Read Only'));
    selectBox.appendChild(createOption('write','Read/Edit/Delete'));
    userDiv.appendChild(selectBox);
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