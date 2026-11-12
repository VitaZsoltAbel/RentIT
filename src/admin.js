const $=s=>document.querySelector(s);
const categories=['Fotó és videó','Barkács','Sport és túra','Elektronika','Egyéb'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('hu-HU').format(n)+' Ft';
async function api(path,data){const r=await fetch('/api/'+path,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{});const x=await r.json();if(!r.ok)throw Error(x.error||'Hiba történt');return x}
function render(items){$('#rows').innerHTML=items.map(x=>`<tr data-id="${esc(x.id)}">
<td><input name="title" value="${esc(x.title)}" maxlength="90" aria-label="Hirdetés neve"></td>
<td><select name="category">${categories.map(c=>`<option ${c===x.category?'selected':''}>${esc(c)}</option>`).join('')}</select></td>
<td><input name="city" value="${esc(x.city)}" maxlength="60" aria-label="Település"></td>
<td><input name="price" type="number" min="1" max="10000000" value="${x.price}" aria-label="Napidíj"></td>
<td><input name="deposit" type="number" min="0" max="10000000" value="${x.deposit}" aria-label="Kaució"></td>
<td><textarea name="description" rows="3" maxlength="1600" aria-label="Leírás">${esc(x.description)}</textarea></td>
<td>${esc(x.owner_name||'Ismeretlen')}<br><small>${esc(x.owner_email||'')}</small></td>
<td><div class="admin-actions"><button class="admin-save" data-save>Mentés</button><button class="delete" data-delete>Törlés</button></div></td></tr>`).join('');}
async function load(){try{const items=await api('admin/listings');render(items);$('#status').textContent=items.length+' hirdetés';}catch(e){$('#status').textContent=e.message}}
$('#rows').addEventListener('click',async e=>{const tr=e.target.closest('tr');if(!tr)return;const id=tr.dataset.id;
try{if(e.target.matches('[data-save]')){const data={id};for(const n of ['title','category','city','price','deposit','description'])data[n]=tr.querySelector(`[name="${n}"]`).value.trim();data.price=Number(data.price);data.deposit=Number(data.deposit);await api('admin/update',data);$('#status').textContent='A hirdetés módosításai elmentve.'}
else if(e.target.matches('[data-delete]')){const title=tr.querySelector('[name="title"]').value;if(!confirm(`Biztosan törlöd ezt a hirdetést: ${title}? A hozzá tartozó foglalások is törlődnek.`))return;await api('admin/delete',{id});tr.remove();$('#status').textContent='A hirdetés törölve.'}}
catch(err){$('#status').textContent=err.message}});
load();