(() => {
  const PRODUCTS = window.MRS_PRODUCTS || [];
  const WHATSAPP = '919080807289';
  const CATEGORIES = ['All','crape Saree','Samantha Saree','Maheshwari Saree','na','Co-ord Sets','Blouss','Jewellery','Accessories'];
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];
  const money = n => `₹${Number(n).toLocaleString('en-IN')}`;
  const encode = s => encodeURIComponent(s);

  const state = {category:'All', query:'', sort:'featured', available:false, selection:loadSelection(), modalProduct:null};

  const els = {
    grid: $('#productGrid'), categoryFilters: $('#categoryFilters'), meta: $('#resultMeta'), sort: $('#sortSelect'), available: $('#availableOnly'), filterRail: $('#filterRail'), toast: $('#toast'),
    modal: $('#productModal'), modalImage: $('#modalMainImage'), thumbs: $('#modalThumbs'), modalCategory: $('#modalCategory'), modalTitle: $('#modalTitle'), modalPrice: $('#modalPrice'), modalDescription: $('#modalDescription'), modalMaterial: $('#modalMaterial'), modalColors: $('#modalColors'), modalAvailability: $('#modalAvailability'), modalWhatsapp: $('#modalWhatsapp'),
    drawer: $('#selectionDrawer'), drawerBody: $('#selectionItems'), selectionCount: $('#selectionCount'), selectionWhatsapp: $('#selectionWhatsapp'),
  };

  function loadSelection(){
    try{return JSON.parse(localStorage.getItem('mrs-selection') || '[]').filter(id=>PRODUCTS.some(p=>p.id===id));}
    catch{return []}
  }
  function saveSelection(){localStorage.setItem('mrs-selection',JSON.stringify(state.selection));}

  function renderFilters(){
    els.categoryFilters.innerHTML = CATEGORIES.map(c => `<button class="chip ${state.category===c?'active':''}" data-category="${c}">${c}</button>`).join('');
  }

  function filteredProducts(){
    let list = PRODUCTS.filter(p => state.category==='All' || p.category===state.category);
    if(state.query) list = list.filter(p => `${p.name} ${p.category} ${p.material} ${p.colors}`.toLowerCase().includes(state.query.toLowerCase()));
    if(state.available) list = list.filter(p=>p.stock>0);
    if(state.sort==='price-low') list.sort((a,b)=>a.price-b.price);
    if(state.sort==='price-high') list.sort((a,b)=>b.price-a.price);
    if(state.sort==='newest') list.sort((a,b)=>b.id.localeCompare(a.id));
    return list;
  }

  function renderProducts(){
    const list=filteredProducts();
    els.meta.textContent = `${list.length} ${list.length===1?'piece':'pieces'} in the current edit${state.query?` · “${state.query}”`:''}`;
    if(!list.length){els.grid.innerHTML='<div class="product-empty"><strong>No pieces matched that edit.</strong><p>Try another category or clear your search.</p></div>';return;}
    els.grid.innerHTML=list.map((p,i)=>`
      <article class="product-card" data-id="${p.id}">
        <div class="product-media" data-open="${p.id}">
          ${p.badge?`<span class="badge">${p.badge}</span>`:''}
          <img src="${p.images[0]}" alt="${p.name}" loading="${i<3?'eager':'lazy'}">
          <div class="product-overlay"><button data-quick="${p.id}">Quick view</button><button data-add="${p.id}">Add to enquiry</button></div>
        </div>
        <div class="product-info"><div class="product-kicker">${p.category}</div><h3 class="product-name">${p.name}</h3><div class="product-bottom"><span class="product-price">${money(p.price)}</span><span class="product-availability">${p.stock>0?'Available to enquire':'Sold out'}</span></div></div>
      </article>`).join('');
  }

  function renderSelection(){
    els.selectionCount.textContent=state.selection.length;
    els.selectionCount.parentElement.setAttribute('aria-label',`Open enquiry bag, ${state.selection.length} selected`);
    const items=state.selection.map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);
    if(!items.length){els.drawerBody.innerHTML='<div class="product-empty" style="padding:70px 10px;border:0"><strong>Your selection is empty.</strong><p>Add pieces you want to discuss with us.</p></div>';} else {
      els.drawerBody.innerHTML=items.map(p=>`<div class="selection-row"><img src="${p.images[0]}" alt="${p.name}"><div><div class="name">${p.name}</div><div class="meta">${p.category} · ${money(p.price)}</div></div><button data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`).join('');
    }
    const text=items.length?`Hi MRS Collections, I’d like to enquire about:%0A${items.map((p,i)=>`${i+1}. ${p.name} — ${money(p.price)}`).join('%0A')}%0A%0APlease share availability and details.`:`Hi MRS Collections, I’d like to browse the collection.`;
    els.selectionWhatsapp.href=`https://wa.me/${WHATSAPP}?text=${text}`;
  }

  function openModal(id){
    const p=PRODUCTS.find(x=>x.id===id); if(!p)return; state.modalProduct=p; els.modal.hidden=false; document.body.style.overflow='hidden';
    els.modalCategory.textContent=`${p.category} / ${p.badge || 'MRS Edit'}`; els.modalTitle.textContent=p.name; els.modalPrice.textContent=money(p.price); els.modalDescription.textContent=p.description; els.modalMaterial.textContent=p.material; els.modalColors.textContent=p.colors; els.modalAvailability.textContent=p.stock>0?'Available to enquire':'Currently sold out';
    els.thumbs.innerHTML=p.images.map((src,i)=>`<button class="${i===0?'active':''}" data-thumb="${i}" aria-label="View image ${i+1}"><img src="${src}" alt=""></button>`).join('');
    els.modalImage.src=p.images[0]; els.modalImage.alt=p.name;
    els.modalWhatsapp.href=`https://wa.me/${WHATSAPP}?text=${encode(`Hi MRS Collections, I’d like to enquire about ${p.name} (${money(p.price)}). Please share availability and details.`)}`;
    $('#addSelection').textContent=state.selection.includes(id)?'Added to enquiry ✓':'Add to enquiry ＋';
  }
  function closeModal(){els.modal.hidden=true;document.body.style.overflow=''}

  function addToSelection(id){
    if(!state.selection.includes(id)){state.selection.push(id);saveSelection();renderSelection();toast('Added to your enquiry selection');}
    else toast('Already in your enquiry selection');
    if(state.modalProduct?.id===id) $('#addSelection').textContent='Added to enquiry ✓';
  }
  function removeFromSelection(id){state.selection=state.selection.filter(x=>x!==id);saveSelection();renderSelection();toast('Removed from selection')}

  function toast(msg){els.toast.textContent=msg;els.toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>els.toast.classList.remove('show'),2200)}
  function openDrawer(){els.drawer.classList.add('open');els.drawer.setAttribute('aria-hidden','false');$('#drawerBackdrop').classList.add('open')}
  function closeDrawer(){els.drawer.classList.remove('open');els.drawer.setAttribute('aria-hidden','true');$('#drawerBackdrop').classList.remove('open')}
  function syncHash(){
    const hash=location.hash.replace(/^#/,'');
    if(hash.startsWith('shop?category=')){const cat=decodeURIComponent(hash.split('=')[1]); if(CATEGORIES.includes(cat)) state.category=cat; renderFilters(); renderProducts(); document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'});}
  }

  renderFilters();renderProducts();renderSelection();$('#year').textContent=new Date().getFullYear();

  document.addEventListener('click',e=>{
    const cat=e.target.closest('[data-category]'); if(cat){state.category=cat.dataset.category;renderFilters();renderProducts();return;}
    const open=e.target.closest('[data-open]'); if(open){openModal(open.dataset.open);return;}
    const quick=e.target.closest('[data-quick]'); if(quick){openModal(quick.dataset.quick);return;}
    const add=e.target.closest('[data-add]'); if(add){addToSelection(add.dataset.add);return;}
    const remove=e.target.closest('[data-remove]'); if(remove){removeFromSelection(remove.dataset.remove);return;}
    const thumb=e.target.closest('[data-thumb]'); if(thumb && state.modalProduct){const i=Number(thumb.dataset.thumb);els.modalImage.src=state.modalProduct.images[i];$$('.thumbs button').forEach((b,j)=>b.classList.toggle('active',i===j));return;}
    if(e.target.id==='addSelection' && state.modalProduct)addToSelection(state.modalProduct.id);
  });

  $('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;renderProducts()});
  $('#availableOnly').addEventListener('change',e=>{state.available=e.target.checked;renderProducts()});
  $('#clearFilters').addEventListener('click',()=>{state.category='All';state.available=false;$('#availableOnly').checked=false;renderFilters();renderProducts()});
  $('#filterToggle').addEventListener('click',()=>els.filterRail.classList.toggle('open'));
  $('#searchToggle').addEventListener('click',()=>{$('#searchPanel').hidden=false;$('#searchInput').focus()});
  $('#searchClose').addEventListener('click',()=>{$('#searchPanel').hidden=true;$('#searchInput').value='';state.query='';renderProducts()});
  $('#searchInput').addEventListener('input',e=>{state.query=e.target.value.trim();renderProducts()});
  $('#modalClose').addEventListener('click',closeModal);els.modal.addEventListener('click',e=>{if(e.target===els.modal)closeModal()});
  $('#selectionToggle').addEventListener('click',openDrawer);$('#drawerClose').addEventListener('click',closeDrawer);$('#drawerBackdrop').addEventListener('click',closeDrawer);$('#clearSelection').addEventListener('click',()=>{state.selection=[];saveSelection();renderSelection();toast('Selection cleared')});
  $('#menuToggle').addEventListener('click',()=>{const n=$('#mobileNav');n.hidden=!n.hidden;$('#menuToggle').setAttribute('aria-expanded',String(!n.hidden))});
  $$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>{const n=$('#mobileNav');n.hidden=true;$('#menuToggle').setAttribute('aria-expanded','false')}));
  window.addEventListener('hashchange',syncHash);syncHash();
  window.addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',scrollY>12),{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeDrawer();$('#searchPanel').hidden=true}});
})();
