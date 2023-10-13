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


// TODO: default time if time not set 9 PM
// TODO: paid (change to signup object instead of another list)
// TODO: change list option to show whether paid or not
// TODO: add database?
// TODO: change me, Jessica, Zikun to be paid by default
// TODO: mention waitlist
// TODO: add option of passing # of courts
// TODO: change list to show how many courts we have and about waitlist
// TODO: whatsapp formatting for messages
// TODO: add option of signing up and signing off multiple times
