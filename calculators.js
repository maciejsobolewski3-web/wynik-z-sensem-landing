const TAX_INTEREST_NO_CHARGE_LIMIT = 8.70;

const pln=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN'}).format(Number(n)||0);
document.querySelectorAll('.calc-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.calc-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.calc-box').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('calc-'+b.dataset.calc).classList.add('active')});
function calcZus(){let a=+zusType.value,h=+zusHealth.value;zusResult.innerHTML=`Społeczne: ${pln(a)} • zdrowotna: ${pln(h)} • razem: ${pln(a+h)}`}
function calcVat(){let a=+vatAmount.value,r=+vatRate.value/100;if(vatMode.value==='net'){let v=a*r;vatResult.innerHTML=`Netto ${pln(a)} • VAT ${pln(v)} • brutto ${pln(a+v)}`}else{let n=a/(1+r);vatResult.innerHTML=`Netto ${pln(n)} • VAT ${pln(a-n)} • brutto ${pln(a)}`}}
function calcLease(){let v=+carValue.value,l=+carLimit.value,f=+leaseFee.value,p=v?Math.min(1,l/v):0;leaseResult.innerHTML=`Proporcja limitu: ${(p*100).toFixed(2)}% • orientacyjna część opłaty: ${pln(f*p)}`}
function calcCash(){let d=+cashLimit.value-(+cashSales.value);cashResult.innerHTML=d>=0?`Do wpisanego limitu pozostaje ${pln(d)}`:`Limit przekroczony o ${pln(-d)}`}
function calcInterest(){let r=+taxRate.value;if(!r){interestResult.textContent='Wpisz aktualną stawkę.';return}interestResult.innerHTML=`Orientacyjne odsetki: ${pln(+taxDebt.value*+taxDays.value*r/100/365)}`}
function calcTrip(){let h=+tripHours.value,r=+dietRate.value,c=+tripCosts.value,d=0;if(h<=24)d=h<8?0:h<=12?r/2:r;else{let f=Math.floor(h/24),x=h%24;d=f*r+(x===0?0:x<=8?r/2:r)}tripResult.innerHTML=`Dieta ${pln(d)} • inne koszty ${pln(c)} • razem ${pln(d+c)}`}
function calcFlat(){let b=Math.max(0,+flatRevenue.value-(+flatDed.value));flatResult.innerHTML=`Podstawa ${pln(b)} • ryczałt ${pln(b*(+flatRate.value/100))}`}


const pkwiuExamples = [
  {keys:["69.20.2","księg","rachunk"], rate:17, label:"Usługi rachunkowo-księgowe / wolny zawód – możliwa stawka 17% przy spełnieniu warunków definicji wolnego zawodu; wymaga weryfikacji."},
  {keys:["62.01","oprogram","programist","software"], rate:12, label:"Usługi związane z oprogramowaniem – często 12%; sprawdź dokładne PKWiU."},
  {keys:["62.02","informat","it","doradztwo informatyczne"], rate:12, label:"Wybrane usługi IT – często 12%; dokładna stawka zależy od grupowania PKWiU."},
  {keys:["63.11","hosting","przetwarzanie danych"], rate:12, label:"Wybrane usługi przetwarzania danych / hostingu – często 12%; wymaga sprawdzenia PKWiU."},
  {keys:["41","42","43","budowl","remont"], rate:5.5, label:"Roboty budowlane – co do zasady 5,5%, po potwierdzeniu klasyfikacji."},
  {keys:["47","handel detal"], rate:3, label:"Działalność usługowa w zakresie handlu – często 3%, z wyjątkami."},
  {keys:["46","handel hurt"], rate:3, label:"Handel – możliwa stawka 3%; sprawdź szczegółowe zasady dla danego rodzaju sprzedaży."},
  {keys:["56","gastronom"], rate:3, label:"Część działalności gastronomicznej może podlegać 3%; rodzaj sprzedaży ma znaczenie."},
  {keys:["49.41","transport","przewóz towar"], rate:5.5, label:"Transport drogowy towarów – często 5,5%; sprawdź warunki i PKWiU."},
  {keys:["73.1","reklam","marketing"], rate:15, label:"Usługi reklamowe – często 15%; wymaga potwierdzenia właściwego PKWiU."},
  {keys:["71.1","architekt","inżynier"], rate:14, label:"Usługi architektoniczne i inżynierskie – często 14%; sprawdź grupowanie PKWiU."},
  {keys:["86","medycz","lekar","opieka zdrowot"], rate:14, label:"Usługi w zakresie opieki zdrowotnej – co do zasady 14%; wymaga właściwej klasyfikacji."}
];

function findPkwiuRate(){
  const q=(document.getElementById('pkwiuSearch').value||'').toLowerCase();
  const match=pkwiuExamples.find(x=>x.keys.some(k=>q.includes(k.toLowerCase())));
  const out=document.getElementById('flatResult');
  if(!q){out.innerHTML='Wpisz symbol PKWiU lub rodzaj usługi.';return;}
  if(!match){
    out.innerHTML='<strong>Stawka wymaga weryfikacji.</strong><br>Nie znaleziono bezpiecznego przyporządkowania w przykładowej bazie. Sprawdź dokładny symbol PKWiU.';
    return;
  }
  document.getElementById('flatRate').value=String(match.rate);
  out.innerHTML='<strong>Orientacyjna stawka: '+String(match.rate).replace('.',',')+'%</strong><br>'+match.label;
}

function checkRyczaltEligibility(){
  const checked=[...document.querySelectorAll('.ryczExcl')].some(x=>x.checked) || document.getElementById('ryczLimit').checked;
  const el=document.getElementById('ryczEligibility');
  if(checked){
    el.className='warning';
    el.innerHTML='<strong>Możliwe wyłączenie z ryczałtu.</strong><br>Co najmniej jedna odpowiedź wskazuje, że trzeba zweryfikować prawo do tej formy opodatkowania przed jej zastosowaniem.';
  }else{
    el.className='ok';
    el.innerHTML='<strong>Brak oczywistego wyłączenia w tym krótkim teście.</strong><br>To nie zastępuje pełnej weryfikacji warunków ustawowych, limitu przychodów i rodzaju działalności.';
  }
}


function toggleVatStart(){
  const on=document.getElementById('vatBusinessType').value==='new';
  document.getElementById('vatStartWrap').style.display=on?'flex':'none';
}
function calcVatLimit(){
  if(document.getElementById('vatExcluded').checked){
    document.getElementById('vatResult').innerHTML='<strong>Zwolnienie podmiotowe może nie przysługiwać.</strong><br>Wskazano czynność wyłączoną z art. 113 ust. 13 ustawy o VAT – wymagana weryfikacja.';
    return;
  }
  const annual=240000; let limit=annual, info='pełny rok 2026';
  if(document.getElementById('vatBusinessType').value==='new'){
    const v=document.getElementById('vatStartDate').value;
    if(!v){document.getElementById('vatResult').textContent='Wybierz datę rozpoczęcia działalności.';return}
    const start=new Date(v+'T00:00:00Z'), end=new Date('2026-12-31T00:00:00Z');
    const days=Math.floor((end-start)/86400000)+1;
    limit=annual*days/365; info=days+' dni';
  }
  const sales=+document.getElementById('vatSales').value||0, left=limit-sales;
  document.getElementById('vatResult').innerHTML=
    `Limit: <strong>${pln(limit)}</strong> (${info})<br>`+
    (left>=0?`Do limitu pozostaje: <strong>${pln(left)}</strong>`:`Limit został przekroczony o: <strong>${pln(-left)}</strong><br><small>Zwolnienie traci się od czynności, którą przekroczono limit.</small>`);
}

function toggleCashStart(){
  document.getElementById('cashStartWrap').style.display=document.getElementById('cashType').value==='new'?'flex':'none';
}
function calcCash(){
  if(document.getElementById('cashMandatory').checked){
    document.getElementById('cashResult').innerHTML='<strong>Sam limit 20 000 zł nie ma tu zastosowania.</strong><br>Wskazano czynność/sytuację wymagającą odrębnej weryfikacji obowiązku kasy.';
    return;
  }
  let limit=20000, info='pełny rok';
  if(document.getElementById('cashType').value==='new'){
    const v=document.getElementById('cashStartDate').value;
    if(!v){document.getElementById('cashResult').textContent='Wybierz datę rozpoczęcia sprzedaży.';return}
    const start=new Date(v+'T00:00:00Z'), end=new Date('2026-12-31T00:00:00Z');
    const days=Math.floor((end-start)/86400000)+1;
    limit=20000*days/365; info=days+' dni';
  }
  const sales=+document.getElementById('cashSales').value||0, left=limit-sales;
  document.getElementById('cashResult').innerHTML=`Limit: <strong>${pln(limit)}</strong> (${info})<br>`+
    (left>=0?`Do limitu pozostaje: <strong>${pln(left)}</strong>`:`Limit przekroczony o: <strong>${pln(-left)}</strong>`);
}

function calcLease(){
  const v=+document.getElementById('carValue').value||0, l=+document.getElementById('carLimit').value||0, f=+document.getElementById('leaseFee').value||0;
  const p=v?Math.min(1,l/v):0;
  document.getElementById('leaseResult').innerHTML=`Proporcja limitu: <strong>${(p*100).toFixed(2)}%</strong><br>Orientacyjna część spłaty wartości auta objęta limitem: <strong>${pln(f*p)}</strong>`;
}

function calcTrip(){
  const h=+document.getElementById('tripHours').value||0, c=+document.getElementById('tripCosts').value||0;
  const b=+document.getElementById('mealBreakfast').value||0, l=+document.getElementById('mealLunch').value||0, d=+document.getElementById('mealDinner').value||0;
  if(document.getElementById('tripType').value==='domestic'){
    const rate=45; let diet=0;
    if(h<=24) diet=h<8?0:(h<=12?rate/2:rate);
    else {const full=Math.floor(h/24), rem=h%24; diet=full*rate+(rem===0?0:(rem<=8?rate/2:rate));}
    const reduction=(b*0.25 + l*0.50 + d*0.25)*rate;
    diet=Math.max(0,diet-reduction);
    document.getElementById('tripResult').innerHTML=`Dieta po pomniejszeniach: <strong>${pln(diet)}</strong> • inne koszty: ${pln(c)} • razem: <strong>${pln(diet+c)}</strong>`;
  }else{
    const sel=document.getElementById('tripCountry'), country=sel.options[sel.selectedIndex].text;
    const [cur,rateS,hotelS]=sel.value.split('|'), rate=+rateS, hotel=+hotelS;
    const full=Math.floor(h/24), rem=h%24; let diet=full*rate+(rem===0?0:(rem<=8?rate/3:(rem<=12?rate/2:rate)));
    const reduction=(b*0.15 + l*0.30 + d*0.30)*rate;
    diet=Math.max(0,diet-reduction);
    document.getElementById('tripResult').innerHTML=`<strong>${country}</strong><br>Dieta po pomniejszeniach: <strong>${diet.toFixed(2)} ${cur}</strong> • limit noclegu: <strong>${hotel.toFixed(2)} ${cur}</strong><br>Inne koszty wpisane ręcznie: ${pln(c)}`;
  }
}

function findPkwiuRateSafe(){
  const q=(document.getElementById('pkwiuSearch').value||'').toLowerCase(), out=document.getElementById('flatResult'), extra=document.getElementById('ryczExtra');
  extra.innerHTML=''; document.getElementById('flatRate').value='';
  if(!q){out.innerHTML='Wpisz symbol PKWiU lub rodzaj usługi.';return}
  if(q.includes('49.41') || q.includes('transport')){
    out.innerHTML='<strong>Transport drogowy towarów – potrzebny dodatkowy warunek.</strong>';
    extra.innerHTML='<div class="exclusion-box"><b>Czy przewóz ładunków jest wykonywany taborem samochodowym o ładowności powyżej 2 ton?</b><br><br><button class="btn btn-secondary" type="button" onclick="setTransport(true)">Tak</button> <button class="btn btn-secondary" type="button" onclick="setTransport(false)">Nie / nie wiem</button><div id="transportRes"></div></div>'; return;
  }
  if(q.includes('62.') || q.includes('oprogram') || q.includes('informat') || q.includes('it')){
    out.innerHTML='<strong>IT – stawka wymaga dokładnej klasyfikacji.</strong><br>Nie każda usługa IT podlega 12%. Sprawdź pełny symbol PKWiU i rzeczywisty zakres usługi.'; return;
  }
  if(q.includes('69.20') || q.includes('księg') || q.includes('rachunk')){
    out.innerHTML='<strong>Usługi księgowe – nie ustawiono stawki automatycznie.</strong><br>17% może dotyczyć wolnego zawodu księgowego po spełnieniu ustawowych warunków. Zakres usług i sposób wykonywania działalności wymagają weryfikacji.'; return;
  }
  if(q.includes('73.1') || q.includes('reklam')){document.getElementById('flatRate').value='15';out.innerHTML='<strong>Możliwa stawka 15%.</strong><br>Usługi reklamowe – potwierdź właściwe PKWiU.';return}
  if(q.includes('71.1') || q.includes('architekt') || q.includes('inżyn')){document.getElementById('flatRate').value='14';out.innerHTML='<strong>Możliwa stawka 14%.</strong><br>Potwierdź zakres i PKWiU.';return}
  if(q.includes('86') || q.includes('medycz') || q.includes('opieka zdrowot')){document.getElementById('flatRate').value='14';out.innerHTML='<strong>Możliwa stawka 14%.</strong><br>Potwierdź zakres i PKWiU.';return}
  if(q.includes('41') || q.includes('42') || q.includes('43') || q.includes('budowl')){document.getElementById('flatRate').value='5.5';out.innerHTML='<strong>Możliwa stawka 5,5%.</strong><br>Roboty budowlane – potwierdź klasyfikację.';return}
  if(q.includes('46') || q.includes('47') || q.includes('handel')){document.getElementById('flatRate').value='3';out.innerHTML='<strong>Możliwa stawka 3%.</strong><br>Sprawdź przedmiot sprzedaży i wyłączenia z ryczałtu.';return}
  if(q.includes('56') || q.includes('gastronom')){out.innerHTML='<strong>Gastronomia – wymaga doprecyzowania.</strong><br>Nie każda sprzedaż gastronomiczna ma tę samą stawkę; znaczenie ma m.in. rodzaj sprzedawanych napojów.';return}
  out.innerHTML='<strong>Stawka wymaga indywidualnej weryfikacji.</strong>';
}
function setTransport(ok){
  const el=document.getElementById('transportRes');
  if(ok){document.getElementById('flatRate').value='5.5';el.className='ok';el.innerHTML='<strong>Możliwa stawka 5,5%.</strong> Potwierdzono warunek ładowności powyżej 2 ton.'}
  else{document.getElementById('flatRate').value='';el.className='warning';el.innerHTML='<strong>Nie przypisano stawki.</strong> Wymagana dalsza weryfikacja.'}
}
function calcFlatSafe(){
  const r=document.getElementById('flatRate').value;
  if(!r){document.getElementById('flatResult').innerHTML='<strong>Najpierw ustal właściwą stawkę.</strong>';return}
  const rev=+document.getElementById('flatRevenue').value||0, ded=+document.getElementById('flatDed').value||0, base=Math.max(0,rev-ded);
  document.getElementById('flatResult').innerHTML=`Podstawa: <strong>${pln(base)}</strong> • stawka: <strong>${String(r).replace('.',',')}%</strong> • orientacyjny ryczałt: <strong>${pln(base*(+r/100))}</strong>`;
}


function zusGetData(){
  return {
    form: document.getElementById('healthTaxForm').value,
    month: +document.getElementById('healthMonth').value,
    income: Math.max(0, +document.getElementById('healthIncome').value || 0),
    revenue: Math.max(0, +document.getElementById('healthRevenue').value || 0)
  };
}

function zusComputeHealth(){
  const d = zusGetData();
  let minimum = 0, calculated = 0, explanation = '';

  if(d.form === 'scale'){
    minimum = d.month === 1 ? 314.96 : 432.54;
    calculated = Math.max(minimum, d.income * 0.09);
    explanation = `Skala: 9% dochodu (${pln(d.income)}), nie mniej niż ${pln(minimum)}.`;
  } else if(d.form === 'linear'){
    minimum = d.month === 1 ? 314.96 : 432.54;
    calculated = Math.max(minimum, d.income * 0.049);
    explanation = `Liniowy: 4,9% dochodu (${pln(d.income)}), nie mniej niż ${pln(minimum)}.`;
  } else if(d.form === 'flat'){
    if(d.revenue <= 60000){
      minimum = calculated = 498.35;
      explanation = `Ryczałt: przychód narastająco ${pln(d.revenue)} – próg do 60 000 zł.`;
    } else if(d.revenue <= 300000){
      minimum = calculated = 830.58;
      explanation = `Ryczałt: przychód narastająco ${pln(d.revenue)} – próg ponad 60 000 zł do 300 000 zł.`;
    } else {
      minimum = calculated = 1495.04;
      explanation = `Ryczałt: przychód narastająco ${pln(d.revenue)} – próg ponad 300 000 zł.`;
    }
  } else if(d.form === 'card'){
    minimum = calculated = 432.54;
    explanation = 'Karta podatkowa: składka zdrowotna 432,54 zł miesięcznie w 2026 r.';
  }

  return {minimum, calculated, explanation};
}

function zusRefresh(){
  const form = document.getElementById('healthTaxForm').value;
  document.getElementById('incomeWrap').style.display =
    (form === 'scale' || form === 'linear') ? 'flex' : 'none';
  document.getElementById('revenueWrap').style.display =
    form === 'flat' ? 'flex' : 'none';

  const x = zusComputeHealth();
  document.getElementById('healthMinimum').value = x.minimum.toFixed(2);
  document.getElementById('healthCalculated').value = x.calculated.toFixed(2);

  const manual = document.getElementById('zusHealth');
  manual.min = x.calculated.toFixed(2);

  // Nie podstawiamy wyliczenia do pola ręcznej korekty.
  // Pole pozostaje puste, chyba że użytkownik sam coś wpisze.
  if (manual.value !== '') {
    zusValidateManual();
  } else {
    manual.setCustomValidity('');
    manual.style.borderColor = '';
  }
}

function zusValidateManual(){
  const manual = document.getElementById('zusHealth');
  const min = +document.getElementById('healthCalculated').value || 0;

  if (manual.value === '') {
    manual.setCustomValidity('');
    manual.style.borderColor = '';
    return;
  }

  const value = +manual.value || 0;
  if(value < min){
    manual.setCustomValidity(`Kwota nie może być niższa niż ${min.toFixed(2)} zł.`);
    manual.style.borderColor = '#B45C5C';
  }else{
    manual.setCustomValidity('');
    manual.style.borderColor = '';
  }
}

function calcZus(){
  zusRefresh();

  const social = +document.getElementById('zusType').value || 0;
  const x = zusComputeHealth();
  const manual = document.getElementById('zusHealth');

  let health = x.calculated;
  let sourceText = 'wyliczona automatycznie';

  if (manual.value !== '') {
    const entered = +manual.value || 0;
    if (entered < x.calculated) {
      manual.setCustomValidity(`Kwota nie może być niższa niż ${x.calculated.toFixed(2)} zł.`);
      manual.reportValidity();
      return;
    }
    health = entered;
    sourceText = 'korekta ręczna';
  }

  document.getElementById('zusResult').innerHTML =
    `${x.explanation}<br>` +
    `Składki społeczne: <strong>${pln(social)}</strong><br>` +
    `Składka zdrowotna (${sourceText}): <strong>${pln(health)}</strong><br>` +
    `Razem ZUS: <strong>${pln(social + health)}</strong>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const manual = document.getElementById('zusHealth');
  if (manual) manual.value = '';
  zusRefresh();
});


function setRadio(name, value){
  const el=document.querySelector(`input[name="${name}"][value="${value}"]`);
  if(el) el.checked=true;
}

function interestOptionChanged(type, value){
  if(value!=='yes') return;
  if(type==='reduced'){
    setRadio('increasedInterest','no');
  }else if(type==='increased'){
    setRadio('reducedInterest','no');
  }
}

function calcInterestExtended(){
  const debt=+document.getElementById('taxDebt').value||0;
  const days=+document.getElementById('taxDays').value||0;
  const baseRate=+document.getElementById('taxRate').value||0;

  if(baseRate<=0){
    document.getElementById('interestResult').innerHTML='<strong>Wpisz aktualną podstawową stawkę odsetek.</strong>';
    return;
  }

  const reduced=document.querySelector('input[name="reducedInterest"]:checked')?.value==='yes';
  const increased=document.querySelector('input[name="increasedInterest"]:checked')?.value==='yes';

  let multiplier=1;
  let label='stawka podstawowa';

  if(reduced){
    multiplier=0.5;
    label='stawka obniżona – 50% stawki podstawowej';
  }else if(increased){
    multiplier=1.5;
    label='stawka podwyższona – 150% stawki podstawowej';
  }

  const appliedRate=baseRate*multiplier;
  const interest=debt*days*(appliedRate/100)/365;

  document.getElementById('interestResult').innerHTML=
    `Zastosowano: <strong>${label}</strong><br>`+
    `Stawka podstawowa: <strong>${baseRate.toFixed(2).replace('.',',')}%</strong><br>`+
    `Stawka zastosowana: <strong>${appliedRate.toFixed(2).replace('.',',')}%</strong><br>`+
    `Orientacyjne odsetki: <strong>${pln(interest)}</strong>`;
}


function updateInterestRates(){
  const base=+document.getElementById('taxRate').value||0;
  const reduced=base*0.5;
  const increased=base*1.5;
  const preview=document.getElementById('interestRatesPreview');
  if(preview){
    preview.innerHTML=
      `Stawka podstawowa: <strong>${base.toFixed(2).replace('.',',')}%</strong><br>`+
      `Stawka obniżona (50%): <strong>${reduced.toFixed(2).replace('.',',')}%</strong><br>`+
      `Stawka podwyższona (150%): <strong>${increased.toFixed(2).replace('.',',')}%</strong>`;
  }
}
document.addEventListener('DOMContentLoaded', updateInterestRates);


function calcTaxDelayDays(){
  const dueVal=document.getElementById('taxDueDate').value;
  const payVal=document.getElementById('taxPaymentDate').value;
  const daysEl=document.getElementById('taxDays');
  const result=document.getElementById('interestResult');

  if(!dueVal || !payVal){
    daysEl.value=0;
    return;
  }

  const due=new Date(dueVal+'T00:00:00Z');
  const pay=new Date(payVal+'T00:00:00Z');

  if(pay<=due){
    daysEl.value=0;
    result.innerHTML='<strong>Brak dni zwłoki.</strong><br>Data zapłaty przypada najpóźniej w terminie płatności.';
    return;
  }

  const days=Math.round((pay-due)/86400000);
  daysEl.value=days;
}

const _calcInterestExtendedWithDates = calcInterestExtended;
calcInterestExtended = function(){
  const due=document.getElementById('taxDueDate').value;
  const pay=document.getElementById('taxPaymentDate').value;
  if(!due || !pay){
    document.getElementById('interestResult').innerHTML='<strong>Wprowadź termin płatności podatku oraz datę zapłaty.</strong>';
    return;
  }
  calcTaxDelayDays();
  _calcInterestExtendedWithDates();
};

document.addEventListener('DOMContentLoaded', calcTaxDelayDays);


function taxInterestRoundPLN(amount){
  // Ustawowe zaokrąglenie do pełnych złotych: < 50 gr w dół, >= 50 gr w górę.
  return Math.floor(amount + 0.5);
}

function calcInterestExtended(){
  const due=document.getElementById('taxDueDate')?.value;
  const pay=document.getElementById('taxPaymentDate')?.value;

  if(document.getElementById('taxDueDate') && (!due || !pay)){
    document.getElementById('interestResult').innerHTML=
      '<strong>Wprowadź termin płatności podatku oraz datę zapłaty.</strong>';
    return;
  }

  if(typeof calcTaxDelayDays === 'function') calcTaxDelayDays();

  const debt=+document.getElementById('taxDebt').value||0;
  const days=+document.getElementById('taxDays').value||0;
  const baseRate=+document.getElementById('taxRate').value||0;

  if(baseRate<=0){
    document.getElementById('interestResult').innerHTML='<strong>Wpisz podstawową stawkę odsetek.</strong>';
    return;
  }

  const reduced=document.querySelector('input[name="reducedInterest"]:checked')?.value==='yes';
  const increased=document.querySelector('input[name="increasedInterest"]:checked')?.value==='yes';

  let multiplier=1, label='stawka podstawowa';
  if(reduced){ multiplier=.5; label='stawka obniżona – 50% stawki podstawowej'; }
  else if(increased){ multiplier=1.5; label='stawka podwyższona – 150% stawki podstawowej'; }

  const appliedRate=baseRate*multiplier;
  const rawInterest=debt*days*(appliedRate/100)/365;
  const roundedInterest=taxInterestRoundPLN(rawInterest);

  let paymentText='';
  if(rawInterest<=TAX_INTEREST_NO_CHARGE_LIMIT){
    paymentText=
      `<div class="ok" style="margin-top:12px"><strong>Do zapłaty: 0 zł</strong><br>`+
      `Wyliczone odsetki przed zaokrągleniem: ${pln(rawInterest)}.<br>`+
      `Kwota nie przekracza ustawowego limitu ${pln(TAX_INTEREST_NO_CHARGE_LIMIT)} – odsetek nie nalicza się.</div>`;
  } else {
    paymentText=
      `<div style="margin-top:12px">Odsetki przed zaokrągleniem: <strong>${pln(rawInterest)}</strong><br>`+
      `Odsetki po zaokrągleniu do pełnych złotych: <strong>${roundedInterest.toLocaleString('pl-PL')} zł</strong><br>`+
      `<strong>Do zapłaty: ${roundedInterest.toLocaleString('pl-PL')} zł</strong></div>`;
  }

  document.getElementById('interestResult').innerHTML=
    `Liczba dni zwłoki: <strong>${days}</strong><br>`+
    `Zastosowano: <strong>${label}</strong><br>`+
    `Stawka podstawowa: <strong>${baseRate.toFixed(2).replace('.',',')}%</strong><br>`+
    `Stawka zastosowana: <strong>${appliedRate.toFixed(2).replace('.',',')}%</strong>`+
    paymentText;
}


function validatePolishNip(value){
  const nip=(value||'').replace(/\D/g,'');
  if(nip.length!==10) return false;
  const w=[6,5,7,2,3,4,5,6,7];
  let sum=0;
  for(let i=0;i<9;i++) sum+=Number(nip[i])*w[i];
  const control=sum%11;
  return control!==10 && control===Number(nip[9]);
}
document.addEventListener('DOMContentLoaded',()=>{
  const el=document.getElementById('ankietaNip');
  if(!el) return;
  el.addEventListener('input',()=>{
    el.value=el.value.replace(/\D/g,'').slice(0,10);
    if(el.value.length===10 && !validatePolishNip(el.value)){
      el.setCustomValidity('Sprawdź NIP – numer ma nieprawidłową cyfrę kontrolną.');
    } else if(el.value.length>0 && el.value.length<10){
      el.setCustomValidity('NIP powinien zawierać 10 cyfr.');
    } else {
      el.setCustomValidity('');
    }
  });
});

function toggleTripType(){document.getElementById('countryWrap').style.display=document.getElementById('tripType').value==='foreign'?'flex':'none';}
