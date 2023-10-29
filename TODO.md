# AMI- Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
# EC2 Setup

# update kernel
sudo yum update -y

# install epel
sudo amazon-linux-extras install epel -y

# install chromium
sudo yum install -y chromium

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh

# install node
nvm install 16.0.0


# install package
npm install --build-from-source


// TODO: add database?
// TODO: change me, Jessica, Zikun to be paid by default
// TODO: mention waitlist
// TODO: whatsapp formatting for messages
// TODO: add option for guests
// TODO: add uneroll from group
// TODO: sort the different lists

Bugs:
Array sorted - not tested
Some weird bug of people not getting tagged?? check diff to see what can go wrong
People leaving and joining the group is causing issues

// TODO: improve adding new stuff to dicts and what not so that you can react to peoples message to give user feedback

// "whatsapp-web.js": "https://github.com/Julzk/whatsapp-web.js/tarball/jkr_hotfix_8",

Group remove notification
GroupNotification {
  id: {
    fromMe: false,
    remote: '120363151328519970@g.us',
    id: '35301513671698613346',
    participant: '16475711215@c.us',
    _serialized: 'false_120363151328519970@g.us_35301513671698613346_16475711215@c.us'
  },
  body: '',
  type: 'remove',
  timestamp: 1698613346,
  chatId: '120363151328519970@g.us',
  author: '16478294770@c.us',
  recipientIds: [ '16475711215@c.us' ]
}

Group add notification 
GroupNotification {
  id: {
    fromMe: false,
    remote: '120363151328519970@g.us',
    id: '16392165511698613295',
    participant: '16475711215@c.us',
    _serialized: 'false_120363151328519970@g.us_16392165511698613295_16475711215@c.us'
  },
  body: '',
  type: 'add',
  timestamp: 1698613295,
  chatId: '120363151328519970@g.us',
  author: '16478294770@c.us',
  recipientIds: [ '16475711215@c.us' ]
}