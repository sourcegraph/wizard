#!/usr/bin/bash
###############################################################################
# Remove everything related to the Sourcegraph Setup Wizard server
###############################################################################
/usr/local/bin/k3s kubectl create -f "$HOME/deploy/install/ingress.yaml"
if /usr/local/bin/k3s kubectl get deploy/sourcegraph-frontend | grep -q 2/2; then
    sudo kill -9 "$(lsof -t -i:30080)"
    /usr/local/bin/k3s kubectl delete endpoints/wizard-ip
    /usr/local/bin/k3s kubectl delete ing wizard-service
    /usr/local/bin/k3s kubectl delete service/wizard-ip
    sudo rm -rf "$HOME/wizard"
    [ "$(whoami)" == 'sourcegraph' ] && sudo env PATH=$PATH:/home/sourcegraph/.nvm/versions/node/v14.16.0/bin /home/sourcegraph/.nvm/versions/node/v14.16.0/lib/node_modules/pm2/bin/pm2 unstartup systemd -u sourcegraph --hp /home/sourcegraph
    [ "$(whoami)" == 'ec2-user' ] && sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v14.16.0/bin /home/ec2-user/.nvm/versions/node/v14.16.0/lib/node_modules/pm2/bin/pm2 unstartup systemd -u ec2-user --hp /home/ec2-user
    echo "Removed"
fi
exit 0
