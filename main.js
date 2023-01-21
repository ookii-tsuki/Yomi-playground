const inputField = document.querySelector('textarea');
const selectMode = document.querySelector('select[name="mode"]');
const selectTo = document.querySelector('select[name="to"]');
const selectRS = document.querySelector('select[name="romaji-system"]');

document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();

    if (inputField.value != '') {
        if (!hasJapanese(inputField.value)) {
            inputField.value = 'Must contain a Japense text';
            inputField.style.color = '#e44646';
            inputField.style.border = '1px solid #e44646';
            return false;
        }

        fetch('https://yomi.onrender.com/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${inputField.value}&mode=${selectMode.value}&to=${selectTo.value}&romaji_system=${selectRS.value}`
        })
            .then(res => res.json())
            .then(data => {
                const json = JSON.parse(data);
                console.log(json);

                document.querySelector('.result').innerHTML = json.converted;
                document.querySelector('.code-snippet code').innerHTML = JSON.stringify(json, null, 2);
                hljs.initHighlightingOnLoad();
            })
    } else {
        inputField.value = 'Type something';
        inputField.style.color = '#e44646';
        inputField.style.border = '1px solid #e44646';
    }
});

document.addEventListener('click', () => {
    if (/(type something|must contain a japense text)/gi.test(inputField.value)) {
        inputField.value = '';
        inputField.removeAttribute('style');
        charCounter.innerHTML = '0/5000';
    }
});

function hasJapanese(text) {
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if ((0x3040 <= charCode && charCode <= 0x30FF) || (0x4E00 <= charCode && charCode <= 0x9FFF)) {
            return true;
        }
    }
    return false;
}

const charCounter = document.querySelector('.char-counter');

inputField.addEventListener('input', () => {
    charCounter.innerHTML = inputField.value.length + '/5000';
});