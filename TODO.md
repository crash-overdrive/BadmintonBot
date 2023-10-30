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


// TODO: add database
// TODO: mention waitlist
// TODO: whatsapp formatting for messages
// TODO: add option for guests ("in +1 / +2 / +3 and out +1 out +2 out +3 and paid +1 paid +2 paid +3 and unpaid +1 unpaid +2 unpaid +3")
// TODO: add uneroll from group
// TODO: improve adding new stuff to dicts and what not so that you can react to peoples message to give user feedback
// TODO: update display name in real time each time list is called (toString is called)
// TODO: Tag people who are in undecided list
// TODO: take paid status out from list command, take it to paid/unpaid list