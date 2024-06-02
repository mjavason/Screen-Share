// const socket = io('http://localhost:3000');
// const socket = io('https://call-ring-prototype-backend.onrender.com');
const socket = io('http://localhost:5000');

const startButton = document.getElementById('call');
const stopButton = document.getElementById('hangup');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const logDiv = document.getElementById('log');
const incomingCallDiv = document.getElementById('incoming-call');
const callerIdSpan = document.getElementById('caller-id');
const acceptButton = document.getElementById('accept');
const declineButton = document.getElementById('decline');
const userIdInput = document.getElementById('userId');
const calleeIdInput = document.getElementById('calleeId');

let localStream;

const log = (message) => {
  const p = document.createElement('p');
  p.textContent = message;
  logDiv.appendChild(p);
};

// fillIn.addEventListener('click', () => {
//   userIdInput.value = 'two';
//   calleeIdInput.value = 'one';

//   socket.emit('register', userIdInput.value);
//   log('Registered successfully.');
//   startLocalStream();
// });

const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: 'stun:stun.services.mozilla.com',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.stunprotocol.org:3478',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.voipbuster.com',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.voipstunt.com',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.voxgratia.org',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.xten.com',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.schlund.de',
      username: '',
      credential: '',
    },
    {
      urls: 'stun:stun.iptel.org',
      username: '',
      credential: '',
    },

    //Premium TURN Servers. Register on https://dashboard.metered.ca/signup to get yours for free
    //The calls with external devices will hardly connect without them
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: '5dde2d2045285ff71a3bfabd',
      credential: 'ePktKiKENLHvMBA4',
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: '5dde2d2045285ff71a3bfabd',
      credential: 'ePktKiKENLHvMBA4',
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: '5dde2d2045285ff71a3bfabd',
      credential: 'ePktKiKENLHvMBA4',
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: '5dde2d2045285ff71a3bfabd',
      credential: 'ePktKiKENLHvMBA4',
    },
    // Express turn
    // {
    //   urls: 'relay1.expressturn.com:3478',
    //   username: 'efYNM7FLFH0TGPR1RA',
    //   credential: 'Wcyy9dXmtIakraMH',
    // },
  ],
});