function insertText(position) {
  const inputs = document.querySelectorAll('#inputContainer input');
  const mainText = document.getElementById("mainText");
  const style = document.getElementById("styleSelect").value;
  let combinedText = '';

  inputs.forEach(input => {
    if (input.value.trim() !== '') {
      combinedText += `<span style="${style}">${input.value}</span> `;
    }
  });

  const newWindow = window.open("", "", "width=600,height=400");
  newWindow.document.write(`<html><body><p>${position === 'before' ? combinedText : ''}${mainText.value}${position === 'after' ? combinedText : ''}</p></body></html>`);
}

function openWindow() {
  insertText('after'); // или сделать выбор позиции опциональным
}

function cloneInput() {
  const container = document.getElementById("inputContainer");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Введите текст";
  container.appendChild(input);
}

function removeInput() {
  const container = document.getElementById("inputContainer");
  if (container.children.length > 1) {
    container.removeChild(container.lastElementChild);
  }
}
