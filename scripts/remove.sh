#!/usr/bin/bash
###############################################################################
# Remove everything related to the Sourcegraph Setup Wizard server
###############################################################################
/usr/local/bin/k3s kubectl create -f "$HOME/deploy/install/ingress.yaml"
if /usr/local/bin/k3s kubectl get deploy/sourcegraph-frontend | grep -q 2/2; then
    sudo pkill npm #sudo kill -9 "$(lsof -t -i:30080)"
    /usr/local/bin/k3s kubectl delete ing wizard-service
    /usr/local/bin/k3s kubectl delete service/wizard-ip
    /usr/local/bin/k3s kubectl delete endpoint/wizard-ip
    echo "Removed"
fi
sudo rm -rf "$HOME/wizard"
exit 0
