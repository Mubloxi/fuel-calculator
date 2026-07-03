document.addEventListener('DOMContentLoaded', () => {
    const mkdInput = document.getElementById('mkdInput');
    const priceInput = document.getElementById('priceInput');
    const dosageInput = document.getElementById('dosageInput');
    const resultLiters = document.getElementById('resultLiters');
    const resultOil = document.getElementById('resultOil');
    const fuelBtns = document.querySelectorAll('.fuel-btn');
    const langSelector = document.getElementById('langSelector');

    let currentPrices = { "95": 0, "98": 0 };

    const translations = {
        mk: {
            title: 'Калкулатор за Гориво <span class="material-icons-round">local_gas_station</span>',
            pricesTitle: 'Цени во МК 🇲🇰',
            lblMk: 'Внеси денари:',
            lblPrice: 'Цена по литар :',
            lblDosage: 'Дозирање на масло/адитив (мл по литар):',
            resLitersTitle: 'Ќе наточиш:',
            resOilTitle: 'Потребно масло / адитив:',
            footerText: 'Заслуга за идејата: Андреј Бурназов | Код: Петар Ѓоргиевски'
        },
        en: {
            title: 'Fuel Calculator <span class="material-icons-round">local_gas_station</span>',
            pricesTitle: 'MK Prices 🇲🇰',
            lblMk: 'Enter amount (MKD):',
            lblPrice: 'Price per liter:',
            lblDosage: 'Oil/Additive dosage (ml per liter):',
            resLitersTitle: 'You will dispense:',
            resOilTitle: 'Required oil / additive:',
            footerText: 'Idea by Andrej Burnazov | Code by Peter Gorgievski'
        }
    };

    langSelector.addEventListener('change', (e) => {
        const lang = e.target.value;
        const dict = translations[lang];
        
        document.getElementById('titleText').innerHTML = dict.title;
        document.getElementById('pricesTitle').innerText = dict.pricesTitle;
        document.getElementById('lblMk').innerText = dict.lblMk;
        document.getElementById('lblPrice').innerText = dict.lblPrice;
        document.getElementById('lblDosage').innerText = dict.lblDosage;
        document.getElementById('resLitersTitle').innerText = dict.resLitersTitle;
        document.getElementById('resOilTitle').innerText = dict.resOilTitle;
        document.getElementById('footerText').innerText = dict.footerText;
    });

    async function fetchPrices() {
        try {
            const res = await fetch('/api/prices');
            currentPrices = await res.json();
            
            document.getElementById('price95').innerText = currentPrices['95'];
            document.getElementById('price98').innerText = currentPrices['98'];
            
            priceInput.value = currentPrices['95'];
            calculate();
        } catch (error) {
            console.error('Грешка при преземање на цените:', error);
        }
    }

    function calculate() {
        const mkd = parseFloat(mkdInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const dosage = parseFloat(dosageInput.value) || 0;

        let liters = 0;
        if (price > 0 && mkd > 0) {
            liters = mkd / price;
        }

        const oilMl = liters * dosage;

        resultLiters.innerText = `${liters.toFixed(2)} L`;
        resultOil.innerText = `${Math.round(oilMl)} ml`;
    }

    [mkdInput, priceInput, dosageInput].forEach(input => {
        input.addEventListener('input', calculate);
    });

    fuelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fuelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const type = btn.dataset.type;
            priceInput.value = currentPrices[type];
            calculate();
        });
    });

    fetchPrices();
});