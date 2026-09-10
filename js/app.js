// ---- mock data ----
const conversations = [
  {
    id: 'elif', name: 'Elif', initial: 'E', color: '#FF6B57', online: true,
    friendStatus: 'friends',
    age: 21, lang: 'Türkçe', bio: 'Resim ve müzikle ilgileniyorum, yeni insanlar tanımayı seviyorum.', interests: ['Resim', 'Müzik', 'Kahve'],
    messages: [
      { from: 'them', text: 'Selam! Profilini gördüm, sen de mi resim yapıyorsun?', day: 'Dün' },
      { from: 'me', text: 'Evet aynen, daha çok dijital illüstrasyon ile uğraşıyorum' },
      { from: 'them', text: 'Çok güzelmiş çalışmaların, hangi programı kullanıyorsun?' },
      { from: 'them', text: 'Procreate mi yoksa Photoshop mu' },
      { from: 'them', text: 'Кстати, я тоже немного рисую, может покажешь свои работы?' },
    ]
  },
  {
    id: 'mert', name: 'Mert', initial: 'M', color: '#6FE3C4', online: false,
    friendStatus: 'none',
    age: 22, lang: 'Türkçe', bio: 'Yazılım okuyorum, akşamları halı sahaya çıkıyorum.', interests: ['Futbol', 'Kodlama'],
    messages: [
      { from: 'them', text: 'Yarın akşam o etkinliğe gidiyor musun?', day: 'Pazartesi' },
      { from: 'me', text: 'Galiba evet, sen de gelsene' },
      { from: 'them', text: 'Bakalım müsait olursam haber veririm 👍' },
    ]
  },
  {
    id: 'derya', name: 'Derya', initial: 'D', color: '#FFC65C', online: true,
    friendStatus: 'sent',
    age: 20, lang: 'Türkçe', bio: 'Aynı mahallede yaşıyoruz, bir gün tanışalım!', interests: ['Yürüyüş', 'Kitap'],
    messages: [
      { from: 'them', text: 'Aynı mahallede oturuyormuşuz galiba 😄', day: 'Bugün' },
      { from: 'them', text: 'Bir gün kahve içelim istersen' },
    ]
  }
];

// ---- friend requests ----
const sentFriendReqs = [
  { id: 'derya', name: 'Derya', color: '#FFC65C', time: 'Bugün' }
];
const receivedFriendReqs = [
  { id: 'cem', name: 'Cem', color: 'linear-gradient(135deg,#FF6B57,#FFC65C)', time: 'Dün', age: 23, bio: 'Müzisyen, konser düşkünü.' }
];
const convState = {};
conversations.forEach(c => convState[c.id] = { lastRead: c.id === 'mert' ? c.messages.length : c.messages.length - 1 });

// ---- friend request dot indicator ----
function updateFriendReqsDot() {
  const dot = document.getElementById('friendReqsDot');
  dot.classList.toggle('show', receivedFriendReqs.length > 0);
}
updateFriendReqsDot();
document.getElementById('friendReqsBtn').classList.add('visible');

// ---- friend requests screen ----
let activeFriendTab = 'received';

document.getElementById('friendReqsBtn').addEventListener('click', openFriendReqsScreen);
document.getElementById('friendReqsBackBtn').addEventListener('click', closeFriendReqsScreen);

function openFriendReqsScreen() {
  activeFriendTab = 'received';
  document.querySelectorAll('.friendReqsTab').forEach(t => t.classList.toggle('active', t.dataset.ftab === 'received'));
  renderFriendReqs();
  document.getElementById('friendReqsScreen').classList.add('active');
}
function closeFriendReqsScreen() {
  document.getElementById('friendReqsScreen').classList.remove('active');
}

document.querySelectorAll('.friendReqsTab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.friendReqsTab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFriendTab = tab.dataset.ftab;
    renderFriendReqs();
  });
});

function renderFriendReqs() {
  const list = document.getElementById('friendReqsList');
  list.innerHTML = '';
  const data = activeFriendTab === 'received' ? receivedFriendReqs : sentFriendReqs;

  if (data.length === 0) {
    list.innerHTML = `<div class="reqEmpty">${activeFriendTab === 'received' ? 'Gelen arkadaşlık isteği yok.' : 'Henüz arkadaşlık isteği göndermedin.'}</div>`;
    return;
  }

  data.forEach(r => {
    const el = document.createElement('div');
    el.className = 'friendReqItem';
    const avatarStyle = r.color.startsWith('linear') ? `background:${r.color}` : `background:${r.color}`;
    const btns = activeFriendTab === 'received'
      ? `<div class="friendReqAccept" data-id="${r.id}">Kabul Et</div><div class="friendReqReject" data-id="${r.id}">Reddet</div>`
      : `<div class="friendReqPending">İstek gönderildi</div>`;
    el.innerHTML = `
      <div class="friendReqAvatar" style="${avatarStyle}">${r.name[0]}</div>
      <div class="friendReqBody">
        <div class="friendReqName">${r.name}</div>
        <div class="friendReqTime">${r.time}</div>
        <div class="friendReqBtns">${btns}</div>
      </div>`;

    // tap anywhere on item (except buttons) to open profile
    el.addEventListener('click', (e) => {
      if (e.target.closest('.friendReqAccept') || e.target.closest('.friendReqReject')) return;
      const conv = conversations.find(c => c.id === r.id);
      const profileData = conv || {
        id: r.id, name: r.name, color: r.color, initial: r.name[0],
        friendStatus: activeFriendTab === 'received' ? 'received' : 'sent',
        age: r.age, bio: r.bio, interests: []
      };
      openUserProfile(profileData);
    });

    list.appendChild(el);
  });

  list.querySelectorAll('.friendReqAccept').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const req = receivedFriendReqs.find(r => r.id === id);
      const idx = receivedFriendReqs.indexOf(req);
      if (idx > -1) receivedFriendReqs.splice(idx, 1);
      const conv = conversations.find(c => c.id === id);
      if (conv) conv.friendStatus = 'friends';
      updateFriendReqsDot();
      renderFriendReqs();
      renderConvList();
    });
  });
  list.querySelectorAll('.friendReqReject').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const idx = receivedFriendReqs.findIndex(r => r.id === id);
      if (idx > -1) receivedFriendReqs.splice(idx, 1);
      updateFriendReqsDot();
      renderFriendReqs();
    });
  });
}

// ---- user profile detail screen ----
let activeUserProfileConv = null;

function openUserProfile(conv) {
  if (!conv) return;
  activeUserProfileConv = conv;

  const initial = conv.initial || (conv.name ? conv.name[0] : '?');
  const avatarStyle = conv.color || '#FF6B57';
  const meta = [conv.age].filter(Boolean).join(' · ');

  document.getElementById('userProfileAvatar').style.background =
    avatarStyle.startsWith('linear') ? avatarStyle : avatarStyle;
  document.getElementById('userProfileAvatar').textContent = initial;
  document.getElementById('userProfileName').textContent = conv.name || '';
  document.getElementById('userProfileMeta').textContent = meta;

  const bioEl = document.getElementById('userProfileBio');
  bioEl.textContent = conv.bio || '';
  bioEl.style.display = conv.bio ? 'block' : 'none';

  const interestsEl = document.getElementById('userProfileInterests');
  interestsEl.innerHTML = (conv.interests || []).map(t => `<div class="userProfileTag">${t}</div>`).join('');

  updateUserProfileFriendBtn(conv);
  document.getElementById('userProfileScreen').classList.add('active');
}

function closeUserProfile() {
  document.getElementById('userProfileScreen').classList.remove('active');
}
document.getElementById('userProfileBackBtn').addEventListener('click', closeUserProfile);

function updateUserProfileFriendBtn(conv) {
  const btn = document.getElementById('userProfileFriendBtn');
  btn.className = '';
  btn.classList.add('status-' + (conv.friendStatus || 'none'));
  const labels = { none: '+ Arkadaş Ekle', sent: 'İstek Gönderildi', received: 'İsteği Kabul Et', friends: '✓ Arkadaş' };
  btn.textContent = labels[conv.friendStatus || 'none'];
}

document.getElementById('userProfileFriendBtn').addEventListener('click', () => {
  if (!activeUserProfileConv) return;
  const conv = activeUserProfileConv;
  const status = conv.friendStatus || 'none';

  if (status === 'none') {
    conv.friendStatus = 'sent';
    const existing = sentFriendReqs.find(r => r.id === conv.id);
    if (!existing) sentFriendReqs.push({ id: conv.id, name: conv.name, color: conv.color, time: 'Şimdi' });
  } else if (status === 'received') {
    conv.friendStatus = 'friends';
    const idx = receivedFriendReqs.findIndex(r => r.id === conv.id);
    if (idx > -1) receivedFriendReqs.splice(idx, 1);
    updateFriendReqsDot();
  } else if (status === 'sent') {
    conv.friendStatus = 'none';
    const idx = sentFriendReqs.findIndex(r => r.id === conv.id);
    if (idx > -1) sentFriendReqs.splice(idx, 1);
  }

  updateUserProfileFriendBtn(conv);
  renderConvList();
});

document.getElementById('userProfileMsgBtn').addEventListener('click', () => {
  closeUserProfile();
  if (activeUserProfileConv) openChat(activeUserProfileConv.id);
});

// ---- chat header: tap name/avatar to view profile ----
document.getElementById('chatHeaderInfo').addEventListener('click', () => {
  const conv = conversations.find(c => c.id === activeConvId);
  if (conv) openUserProfile(conv);
});
document.getElementById('chatAvatar').addEventListener('click', () => {
  const conv = conversations.find(c => c.id === activeConvId);
  if (conv) openUserProfile(conv);
});

// ---- requests (from super-like): separate from regular conversations until matched ----
const sentRequests = [];   // { id, name, color, message, time }
const receivedRequests = [
  {
    id: 'r1', name: 'Yağmur', color: 'linear-gradient(135deg, #B98CFF, #6FE3C4)',
    message: 'Selam, ortak arkadaşımız var sanırım! Tanışalım mı?', time: 'Şimdi',
    status: 'pending',
    thread: [{ from: 'them', text: 'Selam, ortak arkadaşımız var sanırım! Tanışalım mı?' }]
  }
];

function timeLabel(conv) {
  return conv.messages[conv.messages.length - 1].day || '';
}

function renderConvList() {
  const list = document.getElementById('convList');
  list.innerHTML = '';
  conversations.forEach(conv => {
    const last = conv.messages[conv.messages.length - 1];
    const unread = convState[conv.id].lastRead < conv.messages.length && last.from === 'them';
    const item = document.createElement('div');
    item.className = 'convItem';
    item.innerHTML = `
      <div class="avatar" style="background:${conv.color}">
        ${conv.initial}
        ${conv.online ? '<div class="dot"></div>' : ''}
      </div>
      <div class="convBody">
        <div class="convTop">
          <div class="convName">${conv.name}</div>
          <div class="convTime">${timeLabel(conv)}</div>
        </div>
        <div class="convPreview ${unread ? 'unread' : ''}">${last.from === 'me' ? 'Sen: ' : ''}${last.text}</div>
      </div>
      ${unread ? '<div class="unreadDot"></div>' : ''}
    `;
    item.addEventListener('click', () => openChat(conv.id));
    list.appendChild(item);
  });
  document.getElementById('topbarCount').textContent = conversations.length + ' sohbet';
}
renderConvList();

// ---- top tabs: Mesajlar / İstekler ----
let activeReqSub = 'sent';

function renderRequestsDot() {
  const dot = document.getElementById('requestsDot');
  const hasItems = receivedRequests.length > 0;
  dot.classList.toggle('has-items', hasItems);
}

function renderRequests() {
  const list = document.getElementById('reqList');
  const data = activeReqSub === 'sent' ? sentRequests : receivedRequests;
  list.innerHTML = '';

  if (data.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'reqEmpty';
    empty.textContent = activeReqSub === 'sent'
      ? 'Henüz kimseye mesaj isteği göndermedin.'
      : 'Şu an sana gelen bir mesaj isteği yok.';
    list.appendChild(empty);
    return;
  }

  data.forEach(r => {
    const item = document.createElement('div');
    item.className = 'reqItem';
    let badgeText = '';
    if (r.status === 'accepted') badgeText = 'Kabul edildi';
    else if (r.status === 'rejected') badgeText = 'Reddedildi';
    else badgeText = activeReqSub === 'sent' ? 'İstek gönderildi' : 'Yeni istek';

    item.innerHTML = `
      <div class="reqAvatar" style="background:${r.color}">${r.name[0]}</div>
      <div class="reqBody">
        <div class="reqTop">
          <div class="reqName">${r.name}</div>
          <div class="reqTime">${r.time}</div>
        </div>
        <div class="reqMessage">${r.message}</div>
        <div class="reqBadge">${badgeText}</div>
      </div>
    `;
    item.addEventListener('click', () => openRequestDetail(r, activeReqSub));
    list.appendChild(item);
  });
  renderRequestsDot();
}

document.querySelectorAll('.msgTopTab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.msgTopTab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    document.getElementById('convList').classList.toggle('hidden', target !== 'messages');
    document.getElementById('requestsPanel').classList.toggle('active', target === 'requests');
    if (target === 'requests') {
      activeReqSub = 'sent';
      document.querySelectorAll('.reqSubTab').forEach(s => s.classList.toggle('active', s.dataset.sub === 'sent'));
      renderRequests();
    }
  });
});

document.querySelectorAll('.reqSubTab').forEach(sub => {
  sub.addEventListener('click', () => {
    document.querySelectorAll('.reqSubTab').forEach(s => s.classList.remove('active'));
    sub.classList.add('active');
    activeReqSub = sub.dataset.sub;
    renderRequests();
  });
});

renderRequestsDot();

// ---- request detail screen ----
let activeRequest = null;
let activeRequestType = null; // 'sent' or 'received'
const SENT_MESSAGE_LIMIT = 3;

function openRequestDetail(req, type) {
  activeRequest = req;
  activeRequestType = type;

  document.getElementById('reqChatAvatar').style.background = req.color;
  document.getElementById('reqChatAvatar').textContent = req.name[0];
  document.getElementById('reqChatHeaderName').textContent = req.name;
  document.getElementById('reqChatHeaderStatus').textContent =
    req.status === 'accepted' ? 'istek kabul edildi' :
    req.status === 'rejected' ? 'istek reddedildi' : 'mesaj isteği';

  renderRequestThread();
  document.getElementById('requestScreen').classList.add('active');
}

function closeRequestDetail() {
  document.getElementById('requestScreen').classList.remove('active');
  activeRequest = null;
  activeRequestType = null;
}
document.getElementById('reqBackBtn').addEventListener('click', closeRequestDetail);

function renderRequestThread() {
  const box = document.getElementById('reqMessages');
  box.innerHTML = '';
  activeRequest.thread.forEach(m => {
    if (m.system) {
      const note = document.createElement('div');
      note.className = 'reqSystemNote';
      note.textContent = m.text;
      box.appendChild(note);
      return;
    }
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (m.from === 'me' ? 'me' : 'them');
    bubble.textContent = m.text;
    box.appendChild(bubble);
  });

  if (activeRequestType === 'received' && activeRequest.status === 'pending') {
    const note = document.createElement('div');
    note.className = 'reqSystemNote';
    note.textContent = 'Yeni bir mesaj isteğiniz var';
    box.appendChild(note);
  }

  if (activeRequestType === 'sent' && activeRequest.status === 'pending' &&
      activeRequest.sentCount >= SENT_MESSAGE_LIMIT) {
    const note = document.createElement('div');
    note.className = 'reqSystemNote reqSystemNote--limit';
    note.textContent = 'Mesaj hakkı doldu!';
    box.appendChild(note);
  }

  box.scrollTop = box.scrollHeight;

  // show/hide accept-reject row
  const showAcceptRow = activeRequestType === 'received' && activeRequest.status === 'pending';
  document.getElementById('reqAcceptRow').classList.toggle('show', showAcceptRow);

  // composer visibility: received+accepted, or sent (with limit)
  const showComposer = activeRequest.status === 'accepted' ||
    (activeRequestType === 'sent' && activeRequest.status === 'pending');
  document.getElementById('reqComposer').classList.toggle('show', showComposer);

  // limit note for sent + pending
  const limitNote = document.getElementById('reqLimitNote');
  if (activeRequestType === 'sent' && activeRequest.status === 'pending') {
    const remaining = SENT_MESSAGE_LIMIT - activeRequest.sentCount;
    limitNote.textContent = remaining > 0
      ? `İstek kabul edilene kadar ${remaining} mesaj hakkın kaldı`
      : 'Mesaj hakkın bitti, istek kabul edilene kadar bekle';
    limitNote.classList.add('show');
    document.getElementById('reqMsgInput').disabled = remaining <= 0;
    document.getElementById('reqSendBtn').classList.toggle('disabled', remaining <= 0);
  } else {
    limitNote.classList.remove('show');
    document.getElementById('reqMsgInput').disabled = false;
  }
}

document.getElementById('reqAcceptBtn').addEventListener('click', () => {
  if (!activeRequest) return;
  activeRequest.status = 'accepted';
  activeRequest.thread.push({ system: true, text: 'Mesaj isteğini kabul ettiniz' });

  // promote to a real conversation in Mesajlar
  const newConvId = promoteRequestToConversation(activeRequest);

  // remove from receivedRequests entirely
  const idx = receivedRequests.indexOf(activeRequest);
  if (idx > -1) receivedRequests.splice(idx, 1);

  closeRequestDetail();
  renderRequests();
  renderRequestsDot();

  // open the new conversation directly in Mesajlar
  if (newConvId) openChat(newConvId);
});

document.getElementById('reqRejectBtn').addEventListener('click', () => {
  if (!activeRequest) return;
  const idx = receivedRequests.indexOf(activeRequest);
  if (idx > -1) receivedRequests.splice(idx, 1);
  closeRequestDetail();
  renderRequests();
  renderRequestsDot();
});

function promoteRequestToConversation(req) {
  const exists = conversations.find(c => c.id === req.id);
  if (exists) return req.id;
  const newConv = {
    id: req.id,
    name: req.name,
    initial: req.name[0],
    color: req.color,
    online: true,
    messages: req.thread.filter(m => !m.system).map(m => ({ from: m.from, text: m.text }))
  };
  conversations.unshift(newConv);
  convState[newConv.id] = { lastRead: newConv.messages.length };
  renderConvList();
  return newConv.id;
}

// ---- request composer ----
const reqInput = document.getElementById('reqMsgInput');
const reqSendBtn = document.getElementById('reqSendBtn');

function updateReqSendState() {
  const limitReached = activeRequest && activeRequestType === 'sent' && activeRequest.status === 'pending' &&
    activeRequest.sentCount >= SENT_MESSAGE_LIMIT;
  reqSendBtn.classList.toggle('disabled', reqInput.value.trim().length === 0 || limitReached);
}
reqInput.addEventListener('input', () => {
  reqInput.style.height = 'auto';
  reqInput.style.height = Math.min(reqInput.scrollHeight, 90) + 'px';
  updateReqSendState();
});

function sendReqMessage() {
  const text = reqInput.value.trim();
  if (!text || !activeRequest) return;

  if (activeRequestType === 'sent' && activeRequest.status === 'pending') {
    if (activeRequest.sentCount >= SENT_MESSAGE_LIMIT) return;
    activeRequest.thread.push({ from: 'me', text });
    activeRequest.sentCount++;
    activeRequest.message = text;
  } else if (activeRequest.status === 'accepted') {
    activeRequest.thread.push({ from: 'me', text });
  }

  reqInput.value = '';
  reqInput.style.height = 'auto';
  updateReqSendState();
  renderRequestThread();
  if (activeRequestType === 'sent') renderRequests();
}

reqSendBtn.addEventListener('click', sendReqMessage);
reqInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendReqMessage();
  }
});

// ---- chat thread ----
let activeConvId = null;

function openChat(id) {
  activeConvId = id;
  const conv = conversations.find(c => c.id === id);
  convState[id].lastRead = conv.messages.length;

  document.getElementById('chatAvatar').style.background = conv.color;
  document.getElementById('chatAvatar').textContent = conv.initial;
  document.getElementById('chatHeaderName').textContent = conv.name;
  document.getElementById('chatHeaderStatus').textContent = conv.online ? 'çevrimiçi' : 'son görülme: birkaç saat önce';
  document.getElementById('chatHeaderStatus').style.color = conv.online ? 'var(--mint)' : 'var(--text-low)';

  // make sure the Mesajlar tab/screen is the active context underneath
  document.querySelectorAll('.navBtn').forEach(b => b.classList.toggle('active', b.dataset.screen === 'messages'));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-messages').classList.add('active');
  document.getElementById('topbarTitle').textContent = 'Mesajlar';
  document.getElementById('topbarCount').style.display = 'inline';
  document.querySelectorAll('.msgTopTab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'messages'));
  document.getElementById('convList').classList.remove('hidden');
  document.getElementById('requestsPanel').classList.remove('active');

  renderMessages(conv);
  document.getElementById('chatScreen').classList.add('active');
  renderConvList();
}

function closeChat() {
  document.getElementById('chatScreen').classList.remove('active');
  activeConvId = null;
  renderConvList();
}

// ---- translation (demo: known phrase lookup, since there's no live API here) ----
const knownTranslations = {
  'Кстати, я тоже немного рисую, может покажешь свои работы?': 'Bu arada ben de biraz resim çiziyorum, çalışmalarını gösterir misin?'
};

function translateText(text) {
  if (knownTranslations[text]) return knownTranslations[text];
  return '(Bu mesaj için çeviri örneği henüz tanımlı değil)';
}

let longPressTimer = null;
let activeBubbleEl = null;
let activeBubbleMsg = null;

function renderMessages(conv) {
  const box = document.getElementById('messages');
  box.innerHTML = '';
  let lastDay = null;
  conv.messages.forEach(m => {
    if (m.day && m.day !== lastDay) {
      const label = document.createElement('div');
      label.className = 'dayLabel';
      label.textContent = m.day;
      box.appendChild(label);
      lastDay = m.day;
    }
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (m.from === 'me' ? 'me' : 'them');
    bubble.textContent = m.text;

    if (m.from === 'them') {
      bindLongPress(bubble, m);
    }
    box.appendChild(bubble);
  });
  box.scrollTop = box.scrollHeight;
}

function bindLongPress(el, msg) {
  const start = (e) => {
    longPressTimer = setTimeout(() => showTranslateMenu(e, el, msg), 420);
  };
  const cancel = () => clearTimeout(longPressTimer);
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', cancel);
  el.addEventListener('touchmove', cancel);
  el.addEventListener('mousedown', start);
  el.addEventListener('mouseup', cancel);
  el.addEventListener('mouseleave', cancel);
}

function showTranslateMenu(e, bubbleEl, msg) {
  activeBubbleEl = bubbleEl;
  activeBubbleMsg = msg;
  const rect = bubbleEl.getBoundingClientRect();
  const menu = document.getElementById('translateMenu');
  menu.classList.add('show');
  const menuWidth = 140;
  let left = rect.left;
  let top = rect.top - 50;
  if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10;
  if (top < 10) top = rect.bottom + 8;
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';
}

function hideTranslateMenu() {
  document.getElementById('translateMenu').classList.remove('show');
}

document.getElementById('translateMenuBtn').addEventListener('click', () => {
  if (!activeBubbleEl || !activeBubbleMsg) return;
  const translated = translateText(activeBubbleMsg.text);
  activeBubbleEl.innerHTML = `${translated}<div class="bubbleOriginal">${activeBubbleMsg.text}</div>`;
  activeBubbleEl.classList.add('translated');
  hideTranslateMenu();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#translateMenu') && !e.target.closest('.bubble.them')) {
    hideTranslateMenu();
  }
});
document.getElementById('messages').addEventListener('scroll', hideTranslateMenu);

document.getElementById('backBtn').addEventListener('click', closeChat);

// ---- composer ----
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');

function updateSendState() {
  sendBtn.classList.toggle('disabled', input.value.trim().length === 0);
}
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  updateSendState();
});
updateSendState();

function sendMessage() {
  const text = input.value.trim();
  if (!text || !activeConvId) return;
  const conv = conversations.find(c => c.id === activeConvId);
  conv.messages.push({ from: 'me', text });
  input.value = '';
  input.style.height = 'auto';
  updateSendState();
  renderMessages(conv);
  convState[activeConvId].lastRead = conv.messages.length;

  // small simulated reply for realism
  setTimeout(() => {
    const replies = ['Anladım 👍', 'Haklısın!', 'Hahaha aynen öyle', 'Bunu düşünmemiştim, iyi fikir', 'Tamamdır, devam edelim 🙌'];
    conv.messages.push({ from: 'them', text: replies[Math.floor(Math.random() * replies.length)] });
    if (activeConvId === conv.id) {
      renderMessages(conv);
      convState[conv.id].lastRead = conv.messages.length;
    } else {
      renderConvList();
    }
  }, 1100 + Math.random() * 900);
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ---- profile screen logic ----
const profileData = {
  name: 'Ada',
  age: 19,
  langs: ['Türkçe'],
  gender: 'Erkek',
  personality: '',
  zodiac: '',
  heightCm: '',
  heightUnit: 'cm',
  heightFt: '',
  heightIn: '',
  smoking: '',
  alcohol: '',
  pets: '',
  exercise: '',
  familyPlans: '',
  education: '',
  relationshipGoal: '',
  bio: '',
  interests: ['Dijital çizim', 'Oyun', 'Müzik', 'Kahve']
};

// Her modun fotoğrafları ayrı tutulur; mod değişince fotoğraf silinmez.
const modePhotos = {
  friendship: Array(9).fill(null),
  dating: Array(9).fill(null),
  'speed-dating': Array(9).fill(null)
};
const modeBios = {
  friendship: '',
  dating: '',
  'speed-dating': ''
};
let activeProfilePhotoMode = 'friendship';

// Profil kartında fotoğrafların altında gösterilecek detayların ortak öncelik sırası.
function getProfileCardDetails(profile, distanceKm = null, bioOverride = null) {
  const bio = bioOverride !== null ? bioOverride : (profile.bio || '');
  const details = [];
  const addGroup = (type, values) => {
    const items = (Array.isArray(values) ? values : [values]).filter(Boolean);
    if (items.length) details.push({ type, items });
  };

  if (bio.trim()) addGroup('bio', bio.trim());
  if (distanceKm !== null && distanceKm !== undefined && distanceKm !== '') {
    addGroup('distance', `${distanceKm} km uzakta`);
  }

  // Dil ve cinsiyet gösterilmez; yalnızca algoritma verisi olarak kalır.
  addGroup('about', [profile.personality, profile.zodiac, profile.education, profile.familyPlans]);
  addGroup('lifestyle', [profile.pets, profile.alcohol, profile.smoking, profile.exercise]);

  return details;
}

// Flört moduna ait tercihler profil bilgilerinden ayrı tutulur.
const datingPreferences = {
  distanceMinKm: 1,
  distanceMaxKm: 200,
  smoking: '',
  alcohol: '',
  pets: '',
  exercise: '',
  familyPlans: '',
  education: '',
  relationshipGoal: ''
};

// ---- ortak profil seçim paneli ----
const profileChoiceConfigs = {
  height: { title: 'Boy', type: 'height' },
  country: { title: 'Önerilecek ülke', options: ['Tümü', 'Türkiye', 'Almanya', 'ABD', 'İngiltere'] },
  languages: {
    title: 'Konuşabildiğim diller', multiple: true,
    options: ['Türkçe', 'English', 'Deutsch', 'Русский', 'العربية']
  },
  gender: {
    title: 'Cinsiyet', options: ['Kadın', 'Erkek']
  },
  personality: {
    title: 'Kişilik tipi', options: ['Enerjik', 'Sakin', 'Pasif', 'Depresif', 'Dışa dönük', 'İçe dönük']
  },
  zodiac: {
    title: 'Burç', options: ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık']
  },
  smoking: {
    title: 'Sigara durumu', options: ['Aktif içiyorum', 'Bırakmaya çalışıyorum', 'Bıraktım', 'Hiç içmedim']
  },
  alcohol: {
    title: 'Alkol durumu', options: ['Düzenli tüketiyorum', 'Azaltmaya çalışıyorum', 'Bıraktım', 'Hiç tüketmedim']
  },
  pets: {
    title: 'Evcil hayvanlar', options: ['Hayvan istiyorum', 'Kedi', 'Köpek', 'Sürüngen', 'Kuş', 'Tavşan', 'Hamster', 'Diğer', 'Hoşlanmam', 'Hayvanlara alerjim var', 'Hayvanım yok ama çok severim']
  },
  exercise: {
    title: 'Egzersiz', options: ['Ara ara', 'Sık sık', 'Asla yapmam', 'Her gün']
  },
  familyPlans: {
    title: 'Aile planları', options: ['Çocuk istiyorum', 'Çocuk istemiyorum', 'Çocuklarım var ve daha fazlasını istiyorum', 'Çocuklarım var ve daha fazlasını istemiyorum', 'Henüz emin değilim']
  },
  education: {
    title: 'Eğitim', options: ['Üniversite mezunu', 'Lisans öğrencisi', 'Lise', 'Doktora', 'Yüksek lisans öğrencisi', 'Yüksek lisans mezunu', 'Teknik okul']
  },
  relationshipGoal: {
    title: 'Aradığım şey', options: ['Uzun süreli ilişki', 'Uzun ilişki ama kısa da olur', 'Kısa ilişki ama uzun da olur', 'Kısa süreli eğlence', 'Henüz karar vermedim']
  }
};
let preferredGender = 'Herkes';
let preferredZodiacs = ['Tümü'];
let preferredLangs = ['Tümü'];
let preferredCountry = 'Tümü';
let activeProfileChoiceKey = null;

let activeProfileChoiceScope = 'profile';

function getProfileChoiceOptions(key, scope = activeProfileChoiceScope) {
  if (scope === 'preference') {
    if (key === 'gender') return ['Herkes', 'Kadın', 'Erkek'];
    if (key === 'zodiac') return ['Tümü', 'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
    if (key === 'languages') return ['Tümü', 'Türkçe', 'English', 'Deutsch', 'Русский', 'العربية'];
    if (key === 'country') return ['Tümü', 'Türkiye', 'Almanya', 'ABD', 'İngiltere'];
  }
  return profileChoiceConfigs[key].options || [];
}

function getProfileChoiceValue(key, scope = activeProfileChoiceScope) {
  if (scope === 'dating') return datingPreferences[key];
  if (scope === 'preference') {
    if (key === 'gender') return preferredGender;
    if (key === 'zodiac') return preferredZodiacs;
    if (key === 'languages') return preferredLangs;
    if (key === 'country') return preferredCountry;
  }
  if (key === 'languages') return profileData.langs;
  if (key === 'height') {
    if (profileData.heightUnit === 'ftin') {
      if (!profileData.heightFt && !profileData.heightIn) return '';
      return `${profileData.heightFt || ''} ft ${profileData.heightIn || ''} in`.trim();
    }
    return profileData.heightCm ? `${profileData.heightCm} cm` : '';
  }
  return profileData[key];
}

function getProfileChoiceSummary(key, scope = activeProfileChoiceScope) {
  const value = getProfileChoiceValue(key, scope);
  if (Array.isArray(value)) return value.length ? value.join(' · ') : 'Seçilmedi';
  return value || 'Seçilmedi';
}

function syncProfileChoiceRows() {
  Object.keys(profileChoiceConfigs).forEach(key => {
    const profileSummary = getProfileChoiceSummary(key, 'profile');
    const profileValueEl = document.getElementById('profileChoiceValue-' + key);
    const profileLabelEl = document.getElementById('profileChoiceLabel-' + key);
    if (key === 'languages' && profileLabelEl) {
      profileLabelEl.textContent = profileSummary;
      if (profileValueEl) profileValueEl.textContent = 'Dilleri değiştir';
    } else if (profileValueEl) {
      profileValueEl.textContent = profileSummary;
    }
    const datingValueEl = document.getElementById('datingChoiceValue-' + key);
    if (datingValueEl) datingValueEl.textContent = getProfileChoiceSummary(key, 'dating');
    const preferenceValueEl = document.getElementById('discoverPreferenceValue-' + key);
    if (preferenceValueEl) preferenceValueEl.textContent = getProfileChoiceSummary(key, 'preference');
  });
}

function renderProfileChoiceOptions() {
  const key = activeProfileChoiceKey;
  const scope = activeProfileChoiceScope;
  const config = profileChoiceConfigs[key];
  const optionsEl = document.getElementById('profileChoiceSheetOptions');
  document.getElementById('profileChoiceSheetTitle').textContent = config.title;

  if (config.type === 'height') {
    optionsEl.innerHTML = `
      <div class="heightSheetForm">
        <div class="heightSheetInputArea">
          <input type="number" class="heightSheetInput" id="sheetHeightCm" min="80" max="272" placeholder="cm">
          <input type="number" class="heightSheetInput" id="sheetHeightFt" min="1" max="8" placeholder="ft" hidden>
          <input type="number" class="heightSheetInput" id="sheetHeightIn" min="1" max="11" placeholder="in" hidden>
        </div>
        <div class="heightSheetBottomRow">
          <button type="button" id="resetHeightBtn" class="disabled">Boy sıfırlama</button>
          <div class="heightUnitRow">
            <div class="heightUnitOption" data-sheet-height-unit="ftin">ft</div>
            <div class="heightUnitOption" data-sheet-height-unit="cm">cm</div>
          </div>
        </div>
      </div>`;

    const cmInput = document.getElementById('sheetHeightCm');
    const ftInput = document.getElementById('sheetHeightFt');
    const inInput = document.getElementById('sheetHeightIn');
    const resetButton = document.getElementById('resetHeightBtn');
    cmInput.value = profileData.heightCm || '';
    ftInput.value = profileData.heightFt || '';
    inInput.value = profileData.heightIn || '';

    const syncHeightState = () => {
      cmInput.hidden = profileData.heightUnit === 'ftin';
      ftInput.hidden = profileData.heightUnit !== 'ftin';
      inInput.hidden = profileData.heightUnit !== 'ftin';
      optionsEl.querySelectorAll('[data-sheet-height-unit]').forEach(unit => {
        unit.classList.toggle('active', unit.dataset.sheetHeightUnit === profileData.heightUnit);
      });
      const hasHeight = profileData.heightUnit === 'cm'
        ? Boolean(profileData.heightCm)
        : Boolean(profileData.heightFt || profileData.heightIn);
      resetButton.classList.toggle('disabled', !hasHeight);
      syncProfileChoiceRows();
    };

    const boundedValue = (input, min, max) => {
      if (input.value === '') return '';
      const number = Math.max(min, Math.min(max, parseInt(input.value, 10)));
      input.value = number;
      return String(number);
    };
    cmInput.addEventListener('input', e => {
      if (e.target.value !== '') {
        const number = Number(e.target.value);
        if (Number.isFinite(number) && number > 272) e.target.value = '272';
      }
      profileData.heightCm = e.target.value;
      syncHeightState();
    });
    ftInput.addEventListener('input', e => {
      profileData.heightFt = boundedValue(e.target, 1, 8);
      syncHeightState();
    });
    inInput.addEventListener('input', e => {
      profileData.heightIn = boundedValue(e.target, 1, 11);
      syncHeightState();
    });
    resetButton.addEventListener('click', () => {
      profileData.heightCm = '';
      profileData.heightFt = '';
      profileData.heightIn = '';
      cmInput.value = '';
      ftInput.value = '';
      inInput.value = '';
      syncHeightState();
    });
    optionsEl.querySelectorAll('[data-sheet-height-unit]').forEach(unit => {
      unit.addEventListener('click', () => {
        if (unit.dataset.sheetHeightUnit === 'cm') {
          profileData.heightUnit = 'cm';
          profileData.heightFt = '';
          profileData.heightIn = '';
        } else {
          profileData.heightUnit = 'ftin';
          profileData.heightCm = '';
        }
        cmInput.value = profileData.heightCm || '';
        ftInput.value = profileData.heightFt || '';
        inInput.value = profileData.heightIn || '';
        syncHeightState();
      });
    });
    syncHeightState();
    return;
  }

  const choiceOptions = getProfileChoiceOptions(key, scope);
  const selected = getProfileChoiceValue(key, scope);
  const selectedValues = Array.isArray(selected) ? selected : [selected];
  const isPreferenceMulti = scope === 'preference' && (key === 'zodiac' || key === 'languages');
  const isMultiple = Boolean(config.multiple || isPreferenceMulti);
  optionsEl.innerHTML = choiceOptions.map(option => `
    <div class="profileChoiceOption ${selectedValues.includes(option) ? 'active' : ''}" data-profile-option="${option}">
      <span>${option}</span><span class="profileChoiceOptionCheck">✓</span>
    </div>
  `).join('');

  optionsEl.querySelectorAll('.profileChoiceOption').forEach(optionEl => {
    optionEl.addEventListener('click', () => {
      const value = optionEl.dataset.profileOption;

      if (scope === 'preference') {
        if (key === 'gender') {
          preferredGender = preferredGender === value ? '' : value;
        } else if (key === 'country') {
          preferredCountry = preferredCountry === value ? 'Tümü' : value;
        } else {
          const values = key === 'zodiac' ? [...preferredZodiacs] : [...preferredLangs];
          if (value === 'Tümü') {
            values.splice(0, values.length, 'Tümü');
          } else {
            const withoutAll = values.filter(v => v !== 'Tümü');
            const index = withoutAll.indexOf(value);
            if (index >= 0) withoutAll.splice(index, 1);
            else withoutAll.push(value);
            const allSpecific = choiceOptions.filter(v => v !== 'Tümü');
            values.splice(0, values.length, ...(withoutAll.length ? withoutAll : ['Tümü']));
            if (allSpecific.every(item => values.includes(item))) values.splice(0, values.length, 'Tümü');
          }
          if (key === 'zodiac') preferredZodiacs = values;
          else preferredLangs = values;
        }
      } else {
        const store = scope === 'dating' ? datingPreferences : profileData;
        if (isMultiple) {
          const current = key === 'languages' && scope === 'profile' ? profileData.langs : (Array.isArray(store[key]) ? store[key] : []);
          const values = [...current];
          const index = values.indexOf(value);
          if (index >= 0) {
            // Konuşulan diller zorunlu: son kalan dil silinemez.
            if (!(key === 'languages' && scope === 'profile' && values.length === 1)) values.splice(index, 1);
          } else {
            values.push(value);
          }
          if (key === 'languages' && scope === 'profile') profileData.langs = values.length ? values : ['Türkçe'];
          else store[key] = values;
        } else {
          // Profil cinsiyeti zorunlu: seçili değere tekrar basınca boşaltılmaz.
          if (!(key === 'gender' && scope === 'profile' && store[key] === value)) store[key] = value;
        }
      }
      syncProfileChoiceRows();
      refreshCardView();
      renderProfileChoiceOptions();
    });
  });
}

function openProfileChoiceSheet(key, scope = 'profile') {
  activeProfileChoiceKey = key;
  activeProfileChoiceScope = scope;
  renderProfileChoiceOptions();
  document.getElementById('profileChoiceSheetBackdrop').classList.add('show');
}

function closeProfileChoiceSheet() {
  document.getElementById('profileChoiceSheetBackdrop').classList.remove('show');
  activeProfileChoiceKey = null;
  activeProfileChoiceScope = 'profile';
}

document.querySelectorAll('.profileChoiceRow').forEach(row => {
  row.addEventListener('click', () => {
    const scope = row.dataset.profileChoiceScope || (row.closest('#datingPreferenceFields') ? 'dating' : 'profile');
    openProfileChoiceSheet(row.dataset.profileChoice, scope);
  });
});
document.getElementById('profileChoiceSheetClose').addEventListener('click', closeProfileChoiceSheet);
document.getElementById('profileChoiceSheetBackdrop').addEventListener('click', e => {
  if (e.target.id === 'profileChoiceSheetBackdrop') closeProfileChoiceSheet();
});

syncProfileChoiceRows();

function refreshCardView() {
  const name = profileData.name || 'Ada';
  const meta = [profileData.age, profileData.langs?.join('/'), profileData.zodiac].filter(Boolean).join(' · ');
  const initial = name[0].toUpperCase();

  // main row
  document.getElementById('profileMainName').textContent = name;
  document.getElementById('profileMainMeta').textContent = [profileData.age, profileData.langs?.join('/')].filter(Boolean).join(' · ');
  document.getElementById('profileMainInitial').textContent = initial;

  // preview screen
  document.getElementById('profileViewName').textContent = name;
  document.getElementById('profileViewMeta').textContent = meta;
  const pers = document.getElementById('profileViewPersonality');
  pers.textContent = profileData.personality || '';
  pers.style.display = profileData.personality ? 'inline-block' : 'none';
  document.getElementById('profileViewInitial').textContent = initial;
  document.getElementById('profileViewBio').textContent = profileData.bio || '';
  const interestsEl = document.getElementById('profileViewInterests');
  interestsEl.innerHTML = (profileData.interests || []).map(t => `<div class="userProfileTag">${t}</div>`).join('');

  // edit form initial
  const editInitial = document.getElementById('profilePhotoInitial');
  if (editInitial) editInitial.textContent = initial;
}
refreshCardView();

// ---- social stats mock data ----
const socialData = {
  friends: [
    { id: 'elif', name: 'Elif', color: '#FF6B57', meta: '21 · Türkçe', age: 21, lang: 'Türkçe', bio: 'Resim ve müzikle ilgileniyorum, yeni insanlar tanımayı seviyorum.', interests: ['Resim', 'Müzik', 'Kahve'], friendStatus: 'friends' }
  ],
  following: [
    { name: 'Selin', color: 'linear-gradient(135deg,#6FE3C4,#3DA9FF)', meta: '20 · Türkçe', age: 20, lang: 'Türkçe', bio: 'Grafik tasarım okuyorum, bisiklet sürmeyi seviyorum.', interests: ['Tasarım', 'Bisiklet'], friendStatus: 'none' },
    { name: 'Kerem', color: 'linear-gradient(135deg,#B98CFF,#FF6B57)', meta: '22 · Türkçe', age: 22, lang: 'Türkçe', bio: 'Yazılım okuyorum, hafta sonları halı sahaya çıkıyorum.', interests: ['Futbol', 'Kodlama'], friendStatus: 'none' },
    { name: 'Zeynep', color: 'linear-gradient(135deg,#FFC65C,#6FE3C4)', meta: '19 · Türkçe', age: 19, lang: 'Türkçe', bio: 'Kitap kurduyum, aynı zamanda gitar çalıyorum.', interests: ['Kitap', 'Gitar'], friendStatus: 'none' }
  ],
  followers: [
    { id: 'mert', name: 'Mert', color: '#6FE3C4', meta: '22 · Türkçe', age: 22, lang: 'Türkçe', bio: 'Yazılım okuyorum, akşamları halı sahaya çıkıyorum.', interests: ['Futbol', 'Kodlama'], friendStatus: 'none' },
    { id: 'derya', name: 'Derya', color: '#FFC65C', meta: '20 · Türkçe', age: 20, lang: 'Türkçe', bio: 'Aynı mahallede yaşıyoruz, bir gün tanışalım!', interests: ['Yürüyüş', 'Kitap'], friendStatus: 'sent' },
    { name: 'Baran', color: 'linear-gradient(135deg,#FF6B57,#FFC65C)', meta: '21 · Türkçe', age: 21, lang: 'Türkçe', bio: 'Doğa yürüyüşü ve fotoğrafçılıkla ilgileniyorum.', interests: ['Doğa', 'Fotoğraf'], friendStatus: 'none' },
    { name: 'Yağmur', color: 'linear-gradient(135deg,#B98CFF,#6FE3C4)', meta: '20 · Türkçe', age: 20, lang: 'Türkçe', bio: 'Ortak arkadaşlarımız varmış, tanışalım mı?', interests: ['Müzik', 'Sinema'], friendStatus: 'received' },
    { name: 'Cem', color: 'linear-gradient(135deg,#FF6B57,#FFC65C)', meta: '23 · Türkçe', age: 23, lang: 'Türkçe', bio: 'Müzisyen, konser düşkünü.', interests: ['Müzik', 'Konser'], friendStatus: 'none' }
  ]
};

function openSocialList(type) {
  const titles = { friends: 'Arkadaşlar', following: 'Takip Edilenler', followers: 'Takipçiler' };
  document.getElementById('socialListTitle').textContent = titles[type];
  const content = document.getElementById('socialListContent');
  content.innerHTML = '';
  const items = socialData[type] || [];
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'socialListItem';
    const avatarStyle = item.color.startsWith('linear') ? `background:${item.color}` : `background:${item.color}`;
    el.innerHTML = `
      <div class="socialListAvatar" style="${avatarStyle}">${item.name[0]}</div>
      <div>
        <div class="socialListName">${item.name}</div>
        <div class="socialListMeta">${item.meta}</div>
      </div>`;
    el.addEventListener('click', () => {
      // prefer conversations data if available, fallback to socialData item
      const conv = item.id ? conversations.find(c => c.id === item.id) : null;
      openUserProfile(conv || item);
    });
    content.appendChild(el);
  });
  document.getElementById('socialListView').classList.add('active');
  closeSettings(); closePersonalPref();
}
function closeSocialList() {
  document.getElementById('socialListView').classList.remove('active');
}
document.getElementById('socialListBackBtn').addEventListener('click', closeSocialList);
document.getElementById('statFriends').addEventListener('click', () => openSocialList('friends'));
document.getElementById('statFollowing').addEventListener('click', () => openSocialList('following'));
document.getElementById('statFollowers').addEventListener('click', () => openSocialList('followers'));

function openProfileEdit() {
  closeSettings();
  closePersonalPref();
  profileData.bio = modeBios[activeProfilePhotoMode] || '';
  syncProfileChoiceRows();
  updateModePreferenceVisibility();
  document.getElementById('profileEditView').classList.add('active');
  showProfileEditForm();
  updateProfilePreviewTabState();
  if (typeof syncActiveProfileBioEditor === 'function') syncActiveProfileBioEditor();
  requestAnimationFrame(updatePhotoGridPreview);
}

function closeProfileEdit() {
  closeProfileChoiceSheet();
  document.getElementById('profileEditView').classList.remove('active');
  return true;
}
document.getElementById('profileViewEditBtn').addEventListener('click', openProfileEdit);

function openProfileView() {
  refreshCardView();
  document.getElementById('profileViewScreen').classList.add('active');
}
function closeProfileView() {
  document.getElementById('profileViewScreen').classList.remove('active');
}
document.getElementById('profileMainRow').addEventListener('click', openProfileView);
document.getElementById('profileViewBackBtn').addEventListener('click', closeProfileView);
document.getElementById('profileBackBtn').addEventListener('click', closeProfileEdit);

function openSettings() {
  closeProfileEdit();
  closePersonalPref();
  document.getElementById('settingsView').classList.add('active');
}
function closeSettings() {
  document.getElementById('settingsView').classList.remove('active');
}
document.getElementById('settingsRow').addEventListener('click', openSettings);
document.getElementById('settingsBackBtn').addEventListener('click', closeSettings);

// ---- kişisel tercihler (cinsiyet + yaş + burç + dil) ----
function openPersonalPref() {
  closeProfileEdit();
  closeSettings();
  document.getElementById('personalPrefView').classList.add('active');
}
function closePersonalPref() {
  closeZodiacSheet();
  document.getElementById('personalPrefView').classList.remove('active');
}
document.getElementById('personalPrefRow').addEventListener('click', openPersonalPref);
document.getElementById('personalPrefBackBtn').addEventListener('click', closePersonalPref);

// ---- accordion toggle ----
document.querySelectorAll('.accordionHeader').forEach(header => {
  header.addEventListener('click', () => {
    // Burç seçimi artık içeride büyümek yerine alttan panel olarak açılır.
    if (header.classList.contains('zodiacSheetTrigger')) return;

    const item = header.closest('.accordionItem');
    const isOpen = item.classList.contains('open');
    // close all others first
    document.querySelectorAll('.accordionItem').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- zodiac bottom sheet ----
const zodiacSheetBackdrop = document.getElementById('zodiacSheetBackdrop');

function openZodiacSheet() {
  zodiacSheetBackdrop.classList.add('show');
}

function closeZodiacSheet() {
  zodiacSheetBackdrop.classList.remove('show');
}

document.getElementById('zodiacSheetTrigger').addEventListener('click', openZodiacSheet);
document.getElementById('zodiacSheetCloseBtn').addEventListener('click', closeZodiacSheet);
zodiacSheetBackdrop.addEventListener('click', e => {
  if (e.target === zodiacSheetBackdrop) closeZodiacSheet();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeZodiacSheet();
});

function updateAccordionValue(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updatePersonalPrefSummary() {
  const zodiacText = preferredZodiacs.includes('Tümü') || preferredZodiacs.length === 0
    ? 'Tüm burçlar' : preferredZodiacs.join(', ');
  const langText = preferredLangs.includes('Tümü') || preferredLangs.length === 0
    ? 'Tüm diller' : preferredLangs.join(', ');
  document.getElementById('personalPrefRowValue').textContent =
    `${preferredGender} · ${document.getElementById('ageRangeDisplay').textContent} · ${zodiacText} · ${langText}`;
}

document.querySelectorAll('#genderPrefOptions .prefOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#genderPrefOptions .prefOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    preferredGender = opt.dataset.gender;
    updateAccordionValue('genderAccordionVal', preferredGender);
    updatePersonalPrefSummary();
  });
});

// ---- multi-select helper: 'Tümü' is exclusive, specific options can combine ----
function bindMultiSelectPref(containerId, datasetKey, stateArrayGetter, stateArraySetter, accordionValId) {
  document.querySelectorAll(`#${containerId} .prefOption`).forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset[datasetKey];
      let state = stateArrayGetter();

      if (value === 'Tümü') {
        state = ['Tümü'];
      } else {
        state = state.filter(v => v !== 'Tümü');
        if (state.includes(value)) {
          state = state.filter(v => v !== value);
          if (state.length === 0) state = ['Tümü'];
        } else {
          state.push(value);
        }
      }
      stateArraySetter(state);

      document.querySelectorAll(`#${containerId} .prefOption`).forEach(o => {
        o.classList.toggle('active', state.includes(o.dataset[datasetKey]));
      });

      if (accordionValId) {
        const displayText = state.includes('Tümü') ? 'Tümü' : state.join(', ');
        updateAccordionValue(accordionValId, displayText);
      }
      updatePersonalPrefSummary();
    });
  });
}

bindMultiSelectPref('zodiacPrefOptions', 'zodiac', () => preferredZodiacs, (v) => preferredZodiacs = v, 'zodiacAccordionVal');
bindMultiSelectPref('langPrefOptions', 'lang', () => preferredLangs, (v) => preferredLangs = v, 'langAccordionVal');

// Tercihler artık Keşfet içindeki panelde de aynı state ile çalışır.
document.querySelectorAll('#discoverGenderPrefOptions .prefOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#discoverGenderPrefOptions .prefOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    preferredGender = opt.dataset.discoverGender;
    updateAccordionValue('discoverGenderAccordionVal', preferredGender);
  });
});
bindMultiSelectPref('discoverZodiacPrefOptions', 'discoverZodiac', () => preferredZodiacs, (v) => preferredZodiacs = v, 'discoverZodiacAccordionVal');
bindMultiSelectPref('discoverLangPrefOptions', 'discoverLang', () => preferredLangs, (v) => preferredLangs = v, 'discoverLangAccordionVal');

const ageMinSlider = null; // replaced by dual range
const ageMaxSlider = null;
updatePersonalPrefSummary();

// ---- dual handle range slider factory ----
function createDualRange({ trackId, fillId, minHandleId, maxHandleId, minLabelId, maxLabelId, displayId, min, max, valMin, valMax, onChange, showMaxPlus = false, formatDisplay = null }) {
  const track = document.getElementById(trackId);
  const fill = document.getElementById(fillId);
  const hMin = document.getElementById(minHandleId);
  const hMax = document.getElementById(maxHandleId);
  const lMin = document.getElementById(minLabelId);
  const lMax = document.getElementById(maxLabelId);
  const display = document.getElementById(displayId);

  let curMin = valMin, curMax = valMax;
  let renderFrame = 0;

  function pct(v) { return ((v - min) / (max - min)) * 100; }
  function valueAt(clientX) {
    const rect = track.getBoundingClientRect();
    if (!rect.width) return min;
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    return min + ratio * (max - min);
  }
  function render() {
    hMin.style.left = pct(curMin) + '%';
    hMax.style.left = pct(curMax) + '%';
    fill.style.left = pct(curMin) + '%';
    fill.style.width = (pct(curMax) - pct(curMin)) + '%';
    const shownMin = Math.round(curMin);
    const shownMax = showMaxPlus && Math.round(curMax) >= max ? `${max}+` : Math.round(curMax);
    lMin.textContent = shownMin;
    lMax.textContent = shownMax;
    if (display) display.textContent = formatDisplay ? formatDisplay(shownMin, shownMax) : `${shownMin} - ${shownMax}`;
    if (onChange) onChange(curMin, curMax);
  }
  function scheduleRender() {
    if (renderFrame) return;
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      render();
    });
  }
  render();

  function bindHandle(handle, isMin) {
    function onMove(clientX) {
      const val = valueAt(clientX);
      if (isMin) curMin = Math.min(val, curMax);
      else curMax = Math.max(val, curMin);
      scheduleRender();
    }

    handle.addEventListener('touchstart', e => {
      e.preventDefault();
      handle.classList.add('is-dragging');
      hMin.style.zIndex = isMin ? '4' : '3';
      hMax.style.zIndex = isMin ? '3' : '4';
      const move = e2 => {
        if (e2.touches[0]) onMove(e2.touches[0].clientX);
      };
      const end = () => {
        handle.classList.remove('is-dragging');
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
        document.removeEventListener('touchcancel', end);
        window.removeEventListener('blur', end);
      };
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end);
      document.addEventListener('touchcancel', end);
      window.addEventListener('blur', end);
    }, { passive: false });

    handle.addEventListener('mousedown', e => {
      e.preventDefault();
      handle.classList.add('is-dragging');
      hMin.style.zIndex = isMin ? '4' : '3';
      hMax.style.zIndex = isMin ? '3' : '4';
      const move = e2 => {
        // Mouse düğmesi bırakılmışsa, mouseup kaçırılmış olsa bile bırakmayı tamamla.
        if (e2.buttons === 0) {
          end();
          return;
        }
        onMove(e2.clientX);
      };
      const end = () => {
        handle.classList.remove('is-dragging');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
        document.removeEventListener('mouseleave', end);
        window.removeEventListener('blur', end);
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', end);
      document.addEventListener('mouseleave', end);
      window.addEventListener('blur', end);
    });

    handle.addEventListener('dragstart', e => e.preventDefault());
  }
  bindHandle(hMin, true);
  bindHandle(hMax, false);

  track.addEventListener('click', e => {
    if (e.target.closest('.dualHandle')) return;
    const value = valueAt(e.clientX);
    if (Math.abs(value - curMin) <= Math.abs(value - curMax)) curMin = value;
    else curMax = value;
    render();
  });
}

function createSingleRange({ trackId, fillId, handleId, labelId, displayId, min, max, value, onChange }) {
  const track = document.getElementById(trackId);
  const fill = document.getElementById(fillId);
  const handle = document.getElementById(handleId);
  const label = document.getElementById(labelId);
  const display = document.getElementById(displayId);
  let current = value;
  let renderFrame = 0;

  function pct(v) { return ((v - min) / (max - min)) * 100; }
  function valueAt(clientX) {
    const rect = track.getBoundingClientRect();
    if (!rect.width) return min;
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    return Math.round(min + ratio * (max - min));
  }
  function render() {
    const position = pct(current);
    handle.style.left = position + '%';
    fill.style.left = '0%';
    fill.style.width = position + '%';
    label.textContent = current;
    if (display) display.textContent = `${current} km`;
    if (onChange) onChange(current);
  }
  function scheduleRender() {
    if (renderFrame) return;
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      render();
    });
  }
  function onMove(clientX) {
    current = valueAt(clientX);
    scheduleRender();
  }

  handle.addEventListener('touchstart', e => {
    e.preventDefault();
    handle.classList.add('is-dragging');
    const move = e2 => { if (e2.touches[0]) onMove(e2.touches[0].clientX); };
    const end = () => {
      handle.classList.remove('is-dragging');
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
      document.removeEventListener('touchcancel', end);
      window.removeEventListener('blur', end);
    };
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end);
    document.addEventListener('touchcancel', end);
    window.addEventListener('blur', end);
  }, { passive: false });
  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    handle.classList.add('is-dragging');
    const move = e2 => {
      if (e2.buttons === 0) { end(); return; }
      onMove(e2.clientX);
    };
    const end = () => {
      handle.classList.remove('is-dragging');
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('mouseleave', end);
      window.removeEventListener('blur', end);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
    document.addEventListener('mouseleave', end);
    window.addEventListener('blur', end);
  });
  handle.addEventListener('dragstart', e => e.preventDefault());
  track.addEventListener('click', e => {
    if (e.target.closest('.dualHandle')) return;
    current = valueAt(e.clientX);
    render();
  });
  render();
}

createDualRange({
  trackId: 'dualRangeTrack', fillId: 'dualRangeFill',
  minHandleId: 'handleMin', maxHandleId: 'handleMax',
  minLabelId: 'labelMin', maxLabelId: 'labelMax',
  displayId: 'ageRangeDisplay',
  min: 18, max: 60, valMin: 18, valMax: 25,
  onChange: () => updatePersonalPrefSummary()
});

const ALL_THEME_CLASSES = ['light-theme', 'black-theme', 'red-theme', 'pink-theme', 'purple-theme'];
document.querySelectorAll('.themeOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.themeOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    document.body.classList.remove(...ALL_THEME_CLASSES);
    const theme = opt.dataset.theme;
    if (theme !== 'dark') {
      document.body.classList.add(theme + '-theme');
    }
  });
});

function renderInterests() {
  const wrap = document.getElementById('interestTags');
  wrap.innerHTML = '';
  profileData.interests.forEach((tag, i) => {
    const el = document.createElement('div');
    el.className = 'interestTag';
    el.innerHTML = `${tag}<div class="removeTag" data-idx="${i}">✕</div>`;
    wrap.appendChild(el);
  });
  wrap.querySelectorAll('.removeTag').forEach(btn => {
    btn.addEventListener('click', () => {
      profileData.interests.splice(parseInt(btn.dataset.idx), 1);
      renderInterests();
    });
  });
}
renderInterests();

document.getElementById('addInterestBtn').addEventListener('click', addInterest);
document.getElementById('newInterestInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); addInterest(); }
});
function addInterest() {
  const input = document.getElementById('newInterestInput');
  const val = input.value.trim();
  if (!val) return;
  if (profileData.interests.length >= 8) {
    input.placeholder = 'En fazla 8 ilgi alanı ekleyebilirsin';
    return;
  }
  profileData.interests.push(val);
  input.value = '';
  renderInterests();
}

// ---- four profile photo slots ----
let activePhotoSlotIndex = 0;
let suppressNextPhotoClick = false;
let photoReorderTimer = null;
let photoReorderState = null;
let photoDragGhost = null;
const profilePhotoInput = document.getElementById('profilePhotoInput');
const profilePhotoGrid = document.getElementById('profilePhotoGrid');
const profilePhotoSlots = Array.from(document.querySelectorAll('.profilePhotoSlot'));
profilePhotoGrid.addEventListener('contextmenu', e => e.preventDefault());
profilePhotoGrid.addEventListener('dragstart', e => e.preventDefault());

function renderProfilePhotos() {
  const photos = modePhotos[activeProfilePhotoMode];
  profilePhotoSlots.forEach((slot, index) => {
    const photo = photos[index];
    slot.classList.toggle('has-photo', Boolean(photo));
    slot.innerHTML = photo
      ? `<img src="${photo}" alt="Profil fotoğrafı ${index + 1}"><span class="profilePhotoRemove" data-photo-remove="true">×</span>`
      : '<span class="profilePhotoPlus">+</span><span class="profilePhotoAddText">Ekle</span>';
  });
}

function setActiveProfilePhotoMode(modeId) {
  if (!modePhotos[modeId]) return;
  activeProfilePhotoMode = modeId;
  profileData.bio = modeBios[modeId] || '';
  photoGridExpanded = false;
  renderProfilePhotos();
  requestAnimationFrame(updatePhotoGridPreview);
  updateProfilePreviewTabState();
}

function clearPhotoReorderTimer() {
  if (photoReorderTimer) {
    clearTimeout(photoReorderTimer);
    photoReorderTimer = null;
  }
}

function finishPhotoReorder() {
  clearPhotoReorderTimer();
  if (photoDragGhost) {
    photoDragGhost.remove();
    photoDragGhost = null;
  }
  profilePhotoSlots.forEach(slot => slot.classList.remove('photo-dragging', 'photo-drop-target'));
  if (photoReorderState) {
      photoReorderState = null;
    suppressNextPhotoClick = true;
    setTimeout(() => { suppressNextPhotoClick = false; }, 220);
  }
}

function startPhotoReorder(slot, pointerId, clientX, clientY) {
  const index = Number(slot.dataset.photoIndex);
  const photos = modePhotos[activeProfilePhotoMode];
  if (!photos[index]) return;
  photoReorderState = {
    modeId: activeProfilePhotoMode,
    currentIndex: index,
    pointerId,
    lastClientX: clientX,
    lastClientY: clientY
  };
  slot.classList.add('photo-dragging');

  photoDragGhost = document.createElement('div');
  photoDragGhost.className = 'photoDragGhost';
  photoDragGhost.style.width = slot.getBoundingClientRect().width + 'px';
  photoDragGhost.style.height = slot.getBoundingClientRect().height + 'px';
  photoDragGhost.style.left = clientX + 'px';
  photoDragGhost.style.top = clientY + 'px';
  photoDragGhost.innerHTML = `<img src="${photos[index]}" alt="">`;
  document.body.appendChild(photoDragGhost);
  if (slot.setPointerCapture) slot.setPointerCapture(pointerId);
}

function movePhotoReorder(e) {
  if (!photoReorderState) return;
  const clientX = e.clientX;
  const clientY = e.clientY;
  if (typeof e.preventDefault === 'function') e.preventDefault();
  photoReorderState.lastClientX = clientX;
  photoReorderState.lastClientY = clientY;
  if (photoDragGhost) {
    photoDragGhost.style.left = clientX + 'px';
    photoDragGhost.style.top = clientY + 'px';
  }
  const target = document.elementFromPoint(clientX, clientY);
  const targetSlot = target && target.closest('.profilePhotoSlot');
  if (!targetSlot || !profilePhotoGrid.contains(targetSlot)) return;

  const targetIndex = Number(targetSlot.dataset.photoIndex);
  const currentIndex = photoReorderState.currentIndex;
  if (targetIndex === currentIndex) return;
  const photos = modePhotos[photoReorderState.modeId];
  [photos[currentIndex], photos[targetIndex]] = [photos[targetIndex], photos[currentIndex]];
  photoReorderState.currentIndex = targetIndex;
  renderProfilePhotos();
  profilePhotoSlots.forEach(slot => slot.classList.remove('photo-dragging', 'photo-drop-target'));
  profilePhotoSlots[targetIndex].classList.add('photo-dragging', 'photo-drop-target');
}

profilePhotoSlots.forEach(slot => {
  slot.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const index = Number(slot.dataset.photoIndex);
    if (!modePhotos[activeProfilePhotoMode][index]) return;
    clearPhotoReorderTimer();
    photoReorderTimer = setTimeout(() => startPhotoReorder(slot, e.pointerId, e.clientX, e.clientY), 420);
  });
  slot.addEventListener('pointermove', movePhotoReorder);
  slot.addEventListener('pointerup', finishPhotoReorder);
  slot.addEventListener('pointercancel', finishPhotoReorder);
});

document.addEventListener('pointermove', movePhotoReorder);
document.addEventListener('pointerup', finishPhotoReorder);

// Eski mobil tarayıcılar için dokunmatik hareket yedeği.
profilePhotoGrid.addEventListener('touchmove', e => {
  if (!photoReorderState || !e.touches[0]) return;
  const touch = e.touches[0];
  movePhotoReorder({
    clientX: touch.clientX,
    clientY: touch.clientY,
    preventDefault: () => e.preventDefault()
  });
}, { passive: false });
profilePhotoGrid.addEventListener('touchend', finishPhotoReorder);
profilePhotoGrid.addEventListener('touchcancel', finishPhotoReorder);

profilePhotoSlots.forEach(slot => {
  slot.addEventListener('click', e => {
    if (suppressNextPhotoClick) {
      suppressNextPhotoClick = false;
      return;
    }
    if (e.target.closest('[data-photo-remove="true"]')) {
      const index = Number(slot.dataset.photoIndex);
      modePhotos[activeProfilePhotoMode][index] = null;
      renderProfilePhotos();
          updateProfilePreviewTabState();
      e.stopPropagation();
      return;
    }
    activePhotoSlotIndex = Number(slot.dataset.photoIndex);
    profilePhotoInput.value = '';
    profilePhotoInput.click();
  });
});

profilePhotoInput.addEventListener('change', event => {
  const files = Array.from(event.target.files || []).slice(0, 9 - activePhotoSlotIndex);
  if (!files.length) return;

  files.forEach((file, offset) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      modePhotos[activeProfilePhotoMode][activePhotoSlotIndex + offset] = e.target.result;
      renderProfilePhotos();
          updateProfilePreviewTabState();
    };
    reader.readAsDataURL(file);
  });
});

renderProfilePhotos();

let photoGridExpanded = false;
const togglePhotoGridBtn = document.getElementById('togglePhotoGridBtn');

function updatePhotoGridPreview() {
  const firstSlot = profilePhotoSlots[0];
  if (!firstSlot || !togglePhotoGridBtn) return;
  const rowHeight = firstSlot.getBoundingClientRect().height;
  if (!rowHeight) return;
  const gridStyle = getComputedStyle(document.getElementById('profilePhotoGrid'));
  const rowGap = parseFloat(gridStyle.rowGap || gridStyle.gap || '10') || 10;
  const previewHeight = rowHeight + rowGap + Math.min(30, rowHeight * 0.14);
  const grid = document.getElementById('profilePhotoGrid');
  grid.style.maxHeight = photoGridExpanded ? grid.scrollHeight + 'px' : previewHeight + 'px';
  togglePhotoGridBtn.textContent = photoGridExpanded ? 'Fotoğrafları gizle ↑' : 'Tüm fotoğrafları göster ↓';
}

togglePhotoGridBtn.addEventListener('click', () => {
  photoGridExpanded = !photoGridExpanded;
  updatePhotoGridPreview();
});

window.addEventListener('resize', updatePhotoGridPreview);

// ---- profile edit / preview tabs ----
const profileEditView = document.getElementById('profileEditView');
const profileEditEditTab = document.getElementById('profileEditEditTab');
const profileEditPreviewTab = document.getElementById('profileEditPreviewTab');
const profilePreviewView = document.getElementById('profilePreviewView');

function hasCurrentModePhoto() {
  return (modePhotos[activeProfilePhotoMode] || []).some(Boolean);
}

let profilePreviewPhotoIndex = 0;

function getProfilePreviewSelectedFields() {
  return [
    ...(profileData.langs || []),
    profileData.gender,
    profileData.personality,
    profileData.zodiac,
    profileData.heightCm ? `${profileData.heightCm} cm` : '',
    profileData.smoking,
    profileData.alcohol,
    profileData.pets,
    profileData.exercise,
    profileData.familyPlans,
    profileData.education,
    profileData.relationshipGoal
  ].filter(Boolean);
}

function renderProfilePreview() {
  const photos = (modePhotos[activeProfilePhotoMode] || []).filter(Boolean);
  if (profilePreviewPhotoIndex >= photos.length) profilePreviewPhotoIndex = 0;

  const photoEl = document.getElementById('profilePreviewPhoto');
  photoEl.innerHTML = photos.length
    ? `<img src="${photos[profilePreviewPhotoIndex]}" alt="Profil fotoğrafı ${profilePreviewPhotoIndex + 1}">`
    : '';

  const indicators = document.getElementById('profilePreviewPhotoIndicators');
  indicators.innerHTML = photos.map((photo, index) =>
    `<span class="profilePreviewPhotoIndicator ${index === profilePreviewPhotoIndex ? 'active' : ''}"></span>`
  ).join('');

  document.getElementById('profilePreviewName').textContent = profileData.name || '';
  document.getElementById('profilePreviewAge').textContent = profileData.age || '';

  const details = getProfileCardDetails(
    profileData,
    profileData.previewDistanceKm,
    modeBios[activeProfilePhotoMode] || ''
  );
  const currentDetail = details[profilePreviewPhotoIndex];
  const previewDetailBox = document.getElementById('profilePreviewSelectedFields');
  previewDetailBox.innerHTML = currentDetail
    ? currentDetail.items.map(item => currentDetail.type === 'bio'
      ? `<div class="profilePreviewBioDetail">${item}</div>`
      : `<div class="profilePreviewTag">${item}</div>`).join('')
    : '';
  previewDetailBox.classList.toggle('has-scrollable-bio', Boolean(currentDetail && currentDetail.type === 'bio'));

  const previewBioDetail = document.querySelector('.profilePreviewBioDetail');
  if (previewBioDetail) {
    previewBioDetail.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
    previewBioDetail.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
    previewBioDetail.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
    previewBioDetail.addEventListener('mousedown', e => e.stopPropagation());
  }
  document.getElementById('profilePreviewDetailFields').innerHTML = details
    .flatMap(detail => detail.items.map(item => detail.type === 'bio'
      ? `<div class="profilePreviewDetailBio">${item}</div>`
      : `<div class="profilePreviewDetailTag">${item}</div>`))
    .join('');
  document.getElementById('profilePreviewBio').textContent = '';
}

function changeProfilePreviewPhoto(direction) {
  const photos = (modePhotos[activeProfilePhotoMode] || []).filter(Boolean);
  if (photos.length < 2) return;
  profilePreviewPhotoIndex = (profilePreviewPhotoIndex + direction + photos.length) % photos.length;
  renderProfilePreview();
}

function updateProfilePreviewTabState() {
  const hasPhoto = hasCurrentModePhoto();
  profileEditPreviewTab.disabled = !hasPhoto;
  if (!hasPhoto && profileEditView.classList.contains('previewing')) showProfileEditForm();
  if (hasPhoto && profileEditView.classList.contains('previewing')) renderProfilePreview();
}

function showProfileEditForm() {
  profileEditView.classList.remove('previewing');
  profileEditEditTab.classList.add('active');
  profileEditPreviewTab.classList.remove('active');
  profilePreviewCard.classList.remove('details-open');
  profilePreviewDetailToggle.textContent = '↑';
}

function showProfilePreview() {
  if (!hasCurrentModePhoto()) return;
  profilePreviewPhotoIndex = 0;
  profilePreviewCard.classList.remove('details-open');
  profilePreviewDetailToggle.textContent = '↑';
  renderProfilePreview();
  profileEditView.classList.add('previewing');
  profileEditPreviewTab.classList.add('active');
  profileEditEditTab.classList.remove('active');
}

document.getElementById('profileName').addEventListener('input', e => {
  profileData.name = e.target.value;
  refreshCardView();
  if (profileEditView.classList.contains('previewing')) renderProfilePreview();
});
document.getElementById('profileAge').addEventListener('input', e => {
  if (e.target.value !== '') {
    const number = Number(e.target.value);
    if (Number.isFinite(number) && number > 100) e.target.value = '100';
  }
  profileData.age = e.target.value;
  refreshCardView();
  if (profileEditView.classList.contains('previewing')) renderProfilePreview();
});

const profilePreviewDetailToggle = document.getElementById('profilePreviewDetailToggle');
function closeProfilePreviewDetails() {
  profilePreviewCard.classList.remove('details-open');
  profilePreviewDetailToggle.textContent = '↑';
  profilePreviewDetailToggle.setAttribute('aria-label', 'Profil detaylarını aç');
}
profilePreviewDetailToggle.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = profilePreviewCard.classList.toggle('details-open');
  // Sembol sabit kalır; CSS dönüşü açıkken oku aşağı çevirir.
  profilePreviewDetailToggle.textContent = '↑';
  profilePreviewDetailToggle.setAttribute('aria-label', isOpen ? 'Profil detaylarını kapat' : 'Profil detaylarını aç');
});
document.addEventListener('click', e => {
  if (!profilePreviewCard.classList.contains('details-open')) return;
  if (e.target.closest('#profilePreviewDetailsSheet') || e.target.closest('#profilePreviewDetailToggle')) return;
  closeProfilePreviewDetails();
});

let profilePreviewStartX = null;
let profilePreviewSuppressClick = false;
const profilePreviewCard = document.getElementById('profilePreviewCard');
profilePreviewCard.addEventListener('touchstart', e => {
  if (e.target.closest('#profilePreviewDetailsSheet') || e.target.closest('#profilePreviewDetailToggle')) return;
  profilePreviewStartX = e.touches[0].clientX;
}, { passive: true });
profilePreviewCard.addEventListener('touchend', e => {
  if (profilePreviewStartX === null) return;
  const dx = e.changedTouches[0].clientX - profilePreviewStartX;
  profilePreviewStartX = null;
  if (Math.abs(dx) < 40) return;
  profilePreviewSuppressClick = true;
  setTimeout(() => { profilePreviewSuppressClick = false; }, 250);
  changeProfilePreviewPhoto(dx < 0 ? 1 : -1);
});
profilePreviewCard.addEventListener('click', e => {
  if (profilePreviewSuppressClick) return;
  if (e.target.closest('#profilePreviewDetailsSheet') || e.target.closest('#profilePreviewDetailToggle')) return;
  const rect = profilePreviewCard.getBoundingClientRect();
  changeProfilePreviewPhoto(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
});

profileEditEditTab.addEventListener('click', showProfileEditForm);
profileEditPreviewTab.addEventListener('click', showProfilePreview);
updateProfilePreviewTabState();

document.querySelectorAll('#genderSelectRow .genderOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#genderSelectRow .genderOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    profileData.gender = opt.dataset.gender;
  });
});

document.querySelectorAll('#personalitySelectRow .personalityOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#personalitySelectRow .personalityOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    profileData.personality = opt.dataset.personality;
  });
});

document.querySelectorAll('#zodiacSelectRow .zodiacOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#zodiacSelectRow .zodiacOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    profileData.zodiac = opt.dataset.zodiac;
  });
});

// ---- multi-select languages ----
function renderLangTags() {
  const wrap = document.getElementById('langSelectTags');
  wrap.innerHTML = '';
  profileData.langs.forEach((lang, i) => {
    const el = document.createElement('div');
    el.className = 'langSelectedTag';
    el.innerHTML = `${lang}<div class="removeLangTag" data-idx="${i}">✕</div>`;
    wrap.appendChild(el);
  });
  wrap.querySelectorAll('.removeLangTag').forEach(btn => {
    btn.addEventListener('click', () => {
      profileData.langs.splice(parseInt(btn.dataset.idx), 1);
      renderLangTags();
      updateLangOptionVisibility();
    });
  });
}
function updateLangOptionVisibility() {
  document.querySelectorAll('#addLangRow .langOption').forEach(opt => {
    opt.classList.toggle('selected', profileData.langs.includes(opt.dataset.lang));
  });
}
document.querySelectorAll('#addLangRow .langOption').forEach(opt => {
  opt.addEventListener('click', () => {
    const lang = opt.dataset.lang;
    if (!profileData.langs.includes(lang)) {
      profileData.langs.push(lang);
      renderLangTags();
      updateLangOptionVisibility();
    }
  });
});
renderLangTags();
updateLangOptionVisibility();

const profileBioInput = document.getElementById('profileBio');
const profileBioCounter = document.getElementById('profileBioCounter');

function syncActiveProfileBioEditor() {
  profileBioInput.value = modeBios[activeProfilePhotoMode] || '';
  updateProfileBioEditor();
}

function updateProfileBioEditor() {
  const characters = Array.from(profileBioInput.value);
  if (characters.length > 500) {
    profileBioInput.value = characters.slice(0, 500).join('');
  }
  const remaining = 500 - Array.from(profileBioInput.value).length;
  profileBioCounter.textContent = remaining;
  profileBioCounter.style.color = remaining <= 25 ? 'var(--coral)' : 'var(--text-low)';
  profileBioInput.style.height = 'auto';
  const maxBioHeight = 120;
  const contentHeight = Math.max(78, profileBioInput.scrollHeight);
  profileBioInput.style.height = Math.min(contentHeight, maxBioHeight) + 'px';
  profileBioInput.style.overflowY = contentHeight > maxBioHeight ? 'auto' : 'hidden';
  modeBios[activeProfilePhotoMode] = profileBioInput.value;
  profileData.bio = profileBioInput.value;
  refreshCardView();
  if (profileEditView.classList.contains('previewing')) renderProfilePreview();
}

profileBioInput.addEventListener('input', updateProfileBioEditor);
updateProfileBioEditor();

function updateModePreferenceVisibility() {
  const isDating = activeDiscoverModeIndex === 1;
  document.querySelectorAll('.profileDatingOnlyField').forEach(row => {
    if (!isDating) {
      row.style.display = 'none';
    } else {
      row.style.display = row.classList.contains('profileField') || row.classList.contains('profileEditSection') ? 'block' : 'flex';
    }
  });
  const ageSection = document.getElementById('agePreferenceSection');
  if (ageSection) ageSection.style.display = 'block';
}

// ---- discover mode switching ----
const discoverModes = [
  { id: 'friendship', label: 'Arkadaşlık' },
  { id: 'dating', label: 'Flört' },
  { id: 'speed-dating', label: 'Hızlı Flört' }
];
let activeDiscoverModeIndex = 0;
let discoverModeTransitioning = false;
const discoverModeFaces = Array.from(document.querySelectorAll('.discoverModeFace'));

function getDiscoverModeIndex(offset) {
  const total = discoverModes.length;
  return (activeDiscoverModeIndex + offset + total) % total;
}

function renderDiscoverModeSwitcher() {
  const previousIndex = getDiscoverModeIndex(-1);
  const nextIndex = getDiscoverModeIndex(1);

  // Her yazı kendi DOM elemanı olarak kalır; yalnızca rolü değişir.
  // Böylece harfler bir anda değişmez, fiziksel olarak kayarak yer değiştirir.
  discoverModeFaces.forEach(face => {
    const index = Number(face.dataset.modeIndex);
    face.classList.remove('is-current', 'is-prev', 'is-next');

    if (index === activeDiscoverModeIndex) face.classList.add('is-current');
    else if (index === previousIndex) face.classList.add('is-prev');
    else if (index === nextIndex) face.classList.add('is-next');

    const mode = discoverModes[index];
    face.title = mode.label;
    face.setAttribute('aria-label', mode.label + ' moduna geç');
  });
  updateModePreferenceVisibility();
  setActiveProfilePhotoMode(discoverModes[activeDiscoverModeIndex].id);
}

function changeDiscoverMode(direction) {
  if (discoverModeTransitioning) return;
  discoverModeTransitioning = true;
  activeDiscoverModeIndex = getDiscoverModeIndex(direction);
  renderDiscoverModeSwitcher();

  // CSS geçişi tamamlanana kadar yeni bir geçiş başlatma.
  setTimeout(() => {
    discoverModeTransitioning = false;
  }, 600);
}

discoverModeFaces.forEach(face => {
  face.addEventListener('click', () => {
    const index = Number(face.dataset.modeIndex);
    if (index === getDiscoverModeIndex(1)) changeDiscoverMode(1);
    else if (index === getDiscoverModeIndex(-1)) changeDiscoverMode(-1);
  });
});

let discoverModeStartX = null;
let discoverModeStartY = null;
const discoverModeSwitcher = document.getElementById('discoverModeSwitcher');

discoverModeSwitcher.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  discoverModeStartX = touch.clientX;
  discoverModeStartY = touch.clientY;
}, { passive: true });

discoverModeSwitcher.addEventListener('touchend', e => {
  if (discoverModeStartX === null) return;
  const touch = e.changedTouches[0];
  const dx = touch.clientX - discoverModeStartX;
  const dy = touch.clientY - discoverModeStartY;
  discoverModeStartX = null;
  discoverModeStartY = null;
  if (Math.abs(dx) < 35 || Math.abs(dx) < Math.abs(dy)) return;
  // Sola kaydırma sonraki moda, sağa kaydırma önceki moda gider.
  changeDiscoverMode(dx < 0 ? 1 : -1);
});

renderDiscoverModeSwitcher();

// ---- discover screen logic ----
const discoverProfiles = [
  {
    id: 'd1', name: 'Selin', age: 20, lang: 'Türkçe',
    color: 'linear-gradient(135deg, #6FE3C4, #3DA9FF)',
    bio: 'Üniversitede grafik tasarım okuyorum, boş zamanlarımda bisiklet sürmeyi seviyorum.',
    interests: ['Tasarım', 'Bisiklet', 'Sinema']
  },
  {
    id: 'd2', name: 'Kerem', age: 22, lang: 'Türkçe',
    color: 'linear-gradient(135deg, #B98CFF, #FF6B57)',
    bio: 'Yazılım okuyorum, akşamları halı sahaya çıkıyorum. Yeni arkadaşlıklara açığım.',
    interests: ['Futbol', 'Kodlama', 'Diziler']
  },
  {
    id: 'd3', name: 'Zeynep', age: 19, lang: 'Türkçe / English',
    color: 'linear-gradient(135deg, #FFC65C, #6FE3C4)',
    bio: 'Kitap kurduyum, özellikle fantastik türü severim. Aynı zamanda gitar çalıyorum.',
    interests: ['Kitap', 'Gitar', 'Kahve']
  },
  {
    id: 'd4', name: 'Baran', age: 21, lang: 'Türkçe',
    color: 'linear-gradient(135deg, #FF6B57, #FFC65C)',
    bio: 'Doğa yürüyüşü ve fotoğrafçılıkla ilgileniyorum, hafta sonları genelde dışarıdayım.',
    interests: ['Doğa', 'Fotoğraf', 'Kamp']
  }
];

let discoverIndex = 0;
let discoverHistory = []; // for undo: { index, type, createdConvId, createdReqRef }

function renderDiscoverCards() {
  const wrap = document.getElementById('discoverCards');
  wrap.innerHTML = '';
  const visible = discoverProfiles.slice(discoverIndex, discoverIndex + 2);
  visible.forEach((p, i) => {
    const cardDetails = getProfileCardDetails(p, p.distanceKm);
    const primaryDetail = cardDetails[0];
    const primaryBio = primaryDetail && primaryDetail.type === 'bio' ? primaryDetail.items[0] : '';
    const primaryTags = primaryDetail && primaryDetail.type !== 'bio'
      ? primaryDetail.items.map(item => `<div class="cardDetailTag">${item}</div>`).join('')
      : '';
    const card = document.createElement('div');
    card.className = 'discoverCard';
    card.style.zIndex = visible.length - i;
    card.style.transform = i === 1 ? 'scale(0.96) translateY(10px)' : '';
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="cardTop">
        <div class="cardAvatar" style="background:${p.color}"><span>${p.name[0]}</span></div>
        <div class="cardName">${p.name}</div>
        <div class="cardMeta">${p.age}</div>
      </div>
      <div class="cardBody">
        <div class="cardBio">${primaryBio}</div>
        <div class="cardDetailTags">${primaryTags}</div>
        <div class="cardInterests">${p.interests.map(t => `<div class="cardInterestTag">${t}</div>`).join('')}</div>
      </div>
    `;
    wrap.appendChild(card);
    const cardBio = card.querySelector('.cardBio');
    cardBio.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
    cardBio.addEventListener('touchmove', e => e.stopPropagation(), { passive: true });
    cardBio.addEventListener('mousedown', e => e.stopPropagation());
    if (i === 0) bindSwipeGesture(card);
  });
  document.getElementById('discoverEmpty').classList.toggle('show', visible.length === 0);
}
renderDiscoverCards();

// ---- swipe gesture: right=like, left=pass, up=super-like, down=message ----
function bindSwipeGesture(card) {
  let startX = 0, startY = 0, curX = 0, curY = 0, dragging = false;

  function pointerDown(x, y) {
    startX = x; startY = y; curX = x; curY = y;
    dragging = true;
    card.style.transition = 'none';
  }
  function pointerMove(x, y) {
    if (!dragging) return;
    curX = x; curY = y;
    const dx = curX - startX;
    const dy = curY - startY;
    const rotate = dx * 0.04;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
  }
  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    card.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    const dx = curX - startX;
    const dy = curY - startY;
    const THRESHOLD = 90;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) {
      // horizontal swipe
      if (dx > 0) swipeTopCard('right', false);
      else swipeTopCard('left', false);
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > THRESHOLD) {
      // vertical swipe
      if (dy < 0) {
        // up -> super-like
        card.style.transform = 'translateY(-130%) scale(0.9)';
        card.style.opacity = '0';
        swipeTopCardGesture('superlike');
      } else {
        // down -> open message compose, snap card back
        card.style.transform = '';
        openDiscoverMsgModalForTop();
      }
    } else {
      // not a decisive swipe, snap back
      card.style.transform = '';
    }
  }

  card.addEventListener('touchstart', e => {
    const t = e.touches[0];
    pointerDown(t.clientX, t.clientY);
  }, { passive: true });
  card.addEventListener('touchmove', e => {
    const t = e.touches[0];
    pointerMove(t.clientX, t.clientY);
  }, { passive: true });
  card.addEventListener('touchend', pointerUp);

  const moveHandler = e => pointerMove(e.clientX, e.clientY);
  card.addEventListener('mousedown', e => {
    pointerDown(e.clientX, e.clientY);
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', moveHandler);
      pointerUp();
    }, { once: true });
  });
}

// helper to trigger the existing swipeTopCard logic without re-adding the CSS swipe class
// (the gesture handler already animates the card itself for the up/super-like case)
function swipeTopCardGesture(type) {
  const wrap = document.getElementById('discoverCards');
  const top = wrap.querySelector('.discoverCard');
  if (!top) return;
  const profile = discoverProfiles[discoverIndex];
  if (!profile) return;

  const historyEntry = { index: discoverIndex, type };

  const likeMessages = [
    'Selam! Profilin çok ilgimi çekti, tanışalım mı?',
    'Merhaba! İlgi alanlarımız epey örtüşüyor gibi, sohbet edelim mi?',
    'Selam, seninle tanışmak isterim 🙂'
  ];
  const msg = likeMessages[Math.floor(Math.random() * likeMessages.length)];

  const exists = conversations.find(c => c.id === profile.id);
  if (!exists) {
    const newConv = {
      id: profile.id,
      name: profile.name,
      initial: profile.name[0],
      color: profile.color,
      online: true,
      messages: [{ from: 'me', text: msg }]
    };
    conversations.unshift(newConv);
    convState[newConv.id] = { lastRead: newConv.messages.length };
    renderConvList();
    historyEntry.createdConvId = newConv.id;
  }
  triggerStarBurst();
  setTimeout(() => showLikeToast(profile.name, true, true), 280);

  discoverHistory.push(historyEntry);

  setTimeout(() => {
    discoverIndex++;
    renderDiscoverCards();
  }, 260);
}

function openDiscoverMsgModalForTop() {
  document.getElementById('discoverMsgBtn').click();
}

function triggerStarBurst() {
  const star = document.getElementById('superLikeStar');
  star.classList.remove('burst');
  void star.offsetWidth;
  star.classList.add('burst');
  setTimeout(() => star.classList.remove('burst'), 800);
}

function triggerHeartBurst() {
  const heart = document.getElementById('heartIcon');
  heart.classList.remove('burst');
  void heart.offsetWidth;
  heart.classList.add('burst');
  setTimeout(() => heart.classList.remove('burst'), 950);
}


function showLikeToast(name, sentMessage, isInstantChat) {
  const toast = document.getElementById('likeToast');
  let text;
  if (isInstantChat) text = `<b>${name}</b> ile sohbet başladı!`;
  else if (sentMessage) text = `<b>${name}</b>'e mesaj isteği gönderildi`;
  else text = `<b>${name}</b> beğenildi`;
  document.getElementById('likeToastText').innerHTML = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function swipeTopCard(direction, isSuperLike) {
  const wrap = document.getElementById('discoverCards');
  const top = wrap.querySelector('.discoverCard');
  if (!top) return;
  const profile = discoverProfiles[discoverIndex];

  top.classList.add(direction === 'right' ? 'swipe-right' : 'swipe-left');

  if (direction === 'left') { /* no animation */ }

  const historyEntry = { index: discoverIndex, type: direction === 'right' ? (isSuperLike ? 'superlike' : 'like') : 'pass' };

  if (direction === 'right') {
    const likeMessages = [
      'Selam! Profilin çok ilgimi çekti, tanışalım mı?',
      'Merhaba! İlgi alanlarımız epey örtüşüyor gibi, sohbet edelim mi?',
      'Selam, seninle tanışmak isterim 🙂'
    ];
    const msg = likeMessages[Math.floor(Math.random() * likeMessages.length)];

    if (isSuperLike) {
      // super-like: starts a real conversation immediately, no request step
      const exists = conversations.find(c => c.id === profile.id);
      if (!exists) {
        const newConv = {
          id: profile.id,
          name: profile.name,
          initial: profile.name[0],
          color: profile.color,
          online: true,
          messages: [{ from: 'me', text: msg }]
        };
        conversations.unshift(newConv);
        convState[newConv.id] = { lastRead: newConv.messages.length };
        renderConvList();
        historyEntry.createdConvId = newConv.id;
      }
      triggerStarBurst();
      setTimeout(() => showLikeToast(profile.name, true, true), 280);
    } else {
      // regular like: goes out as a pending request, limited to 3 messages
      const newReq = {
        id: profile.id,
        name: profile.name,
        color: profile.color,
        message: msg,
        time: 'Şimdi',
        status: 'pending',
        sentCount: 1,
        thread: [{ from: 'me', text: msg }]
      };
      sentRequests.push(newReq);
      renderRequestsDot();
      historyEntry.createdReqRef = newReq;
      triggerHeartBurst();
      setTimeout(() => showLikeToast(profile.name, true, false), 280);
    }
  }

  discoverHistory.push(historyEntry);

  setTimeout(() => {
    discoverIndex++;
    renderDiscoverCards();
  }, 260);
}

document.getElementById('likeBtn').addEventListener('click', () => swipeTopCard('right', false));

// ---- undo last discover action ----
document.getElementById('undoBtn').addEventListener('click', () => {
  const entry = discoverHistory.pop();
  if (!entry) {
    document.getElementById('likeToastText').textContent = 'Geri alınacak bir işlem yok';
    document.getElementById('likeToast').classList.add('show');
    setTimeout(() => document.getElementById('likeToast').classList.remove('show'), 1800);
    return;
  }

  // undo side effects
  if (entry.createdConvId) {
    const idx = conversations.findIndex(c => c.id === entry.createdConvId);
    if (idx > -1) conversations.splice(idx, 1);
    delete convState[entry.createdConvId];
    renderConvList();
  }
  if (entry.createdReqRef) {
    const idx = sentRequests.indexOf(entry.createdReqRef);
    if (idx > -1) sentRequests.splice(idx, 1);
    renderRequestsDot();
  }

  discoverIndex = entry.index;
  renderDiscoverCards();

  const profile = discoverProfiles[discoverIndex];
  if (profile) {
    document.getElementById('likeToastText').innerHTML = `<b>${profile.name}</b> geri getirildi`;
    document.getElementById('likeToast').classList.add('show');
    setTimeout(() => document.getElementById('likeToast').classList.remove('show'), 1800);
  }
});

// ---- discover filter (country + age) ----
function openDiscoverFilter() {
  document.getElementById('discoverFilterView').classList.add('active');
}
function closeDiscoverFilter() {
  document.getElementById('discoverFilterView').classList.remove('active');
}
document.getElementById('discoverFilterBtn').addEventListener('click', openDiscoverFilter);
document.getElementById('discoverFilterBackBtn').addEventListener('click', closeDiscoverFilter);

document.querySelectorAll('#countryPrefOptions .prefOption').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#countryPrefOptions .prefOption').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    preferredCountry = opt.dataset.country;
    updateAccordionValue('countryAccordionVal', preferredCountry);
  });
});

document.getElementById('superLikeBtn').addEventListener('click', () => swipeTopCard('right', true));

createDualRange({
  trackId: 'discoverDualRangeTrack', fillId: 'discoverDualRangeFill',
  minHandleId: 'discoverHandleMin', maxHandleId: 'discoverHandleMax',
  minLabelId: 'discoverLabelMin', maxLabelId: 'discoverLabelMax',
  displayId: 'discoverAgeRangeDisplay',
  min: 18, max: 100, valMin: 18, valMax: 25,
  showMaxPlus: true,
  formatDisplay: (minValue, maxValue) => `${minValue} - ${maxValue}`,
  onChange: null
});

createSingleRange({
  trackId: 'discoverDistanceTrack', fillId: 'discoverDistanceFill',
  handleId: 'discoverDistanceHandle', labelId: 'discoverDistanceLabel',
  displayId: 'discoverDistanceDisplay',
  min: 1, max: 200, value: 200,
  onChange: value => {
    datingPreferences.distanceMinKm = 1;
    datingPreferences.distanceMaxKm = value;
  }
});

document.getElementById('passBtn').addEventListener('click', () => swipeTopCard('left', false));

// ---- discover: custom message compose ----
document.getElementById('discoverMsgBtn').addEventListener('click', () => {
  const profile = discoverProfiles[discoverIndex];
  if (!profile) return;
  document.getElementById('discoverMsgModalAvatar').style.background = profile.color;
  document.getElementById('discoverMsgModalAvatar').textContent = profile.name[0];
  document.getElementById('discoverMsgModalName').textContent = profile.name;
  document.getElementById('discoverMsgModalInput').value = '';
  updateDiscoverMsgSendState();
  document.getElementById('discoverMsgModal').classList.add('show');
});

function updateDiscoverMsgSendState() {
  const val = document.getElementById('discoverMsgModalInput').value.trim();
  document.getElementById('discoverMsgModalSend').classList.toggle('disabled', val.length === 0);
}
document.getElementById('discoverMsgModalInput').addEventListener('input', updateDiscoverMsgSendState);

document.getElementById('discoverMsgModalCancel').addEventListener('click', () => {
  document.getElementById('discoverMsgModal').classList.remove('show');
});

document.getElementById('discoverMsgModalSend').addEventListener('click', () => {
  const text = document.getElementById('discoverMsgModalInput').value.trim();
  if (!text) return;
  const profile = discoverProfiles[discoverIndex];
  if (!profile) return;

  sentRequests.push({
    id: profile.id,
    name: profile.name,
    color: profile.color,
    message: text,
    time: 'Şimdi',
    status: 'pending',
    sentCount: 1,
    thread: [{ from: 'me', text }]
  });
  renderRequestsDot();

  document.getElementById('discoverMsgModal').classList.remove('show');
  triggerHeartBurst();
  showLikeToast(profile.name, true, false);

  // move on to the next match, same as like/pass
  const wrap = document.getElementById('discoverCards');
  const top = wrap.querySelector('.discoverCard');
  if (top) top.classList.add('swipe-right');
  setTimeout(() => {
    discoverIndex++;
    renderDiscoverCards();
  }, 260);
});

// ---- bottom nav switching ----
const screenTitles = { messages: 'Mesajlar', like: 'Keşfet', profile: 'Profilim' };
document.querySelectorAll('.navBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('profileEditView').classList.contains('active')) closeProfileEdit();
    const target = btn.dataset.screen;
    document.querySelectorAll('.navBtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + target).classList.add('active');
    document.getElementById('topbarTitle').textContent = screenTitles[target];
    document.getElementById('topbarCount').style.display = target === 'messages' ? 'inline' : 'none';
    document.getElementById('friendReqsBtn').classList.toggle('visible', target === 'messages');
    closeChat();

    if (target === 'messages') {
      // always return to the Mesajlar sub-tab, not wherever İstekler was left
      document.querySelectorAll('.msgTopTab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'messages'));
      document.getElementById('convList').classList.remove('hidden');
      document.getElementById('requestsPanel').classList.remove('active');
    }

    if (target === 'profile') {
      // always return to the profile card view, not settings/edit/prefs sub-screens
      closeProfileEdit();
      closeSettings();
      closePersonalPref();
      closeSocialList();
      closeProfileView();
    }

    if (target === 'like') {
      closeDiscoverFilter();
    }
  });
});
