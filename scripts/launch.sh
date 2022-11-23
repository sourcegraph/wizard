#!/usr/bin/bash
###############################################################################
# Start Sourcegraph
###############################################################################
# Using SSH to clone repositories
if [ -f "$HOME/.ssh/id_rsa" ] && [ -f "$HOME/.ssh/known_hosts" ]; then
    # create the secret with the uploaded files
    /usr/local/bin/k3s kubectl create secret generic gitserver-ssh \
        --from-file id_rsa="$HOME/.ssh/id_rsa" \
        --from-file known_hosts="$HOME/.ssh/known_hosts"
    # remove comment for sshSecret to reference the secrets in our override file
    sed -i -e 's/\#sshSecret/sshSecret/' "$HOME/deploy/install/override.yaml"
fi
/usr/local/bin/helm --kubeconfig /etc/rancher/k3s/k3s.yaml upgrade -i -f "$HOME/deploy/install/override.yaml" sourcegraph sourcegraph/sourcegraph
sleep 10
sudo cp -f "$HOME/.sourcegraph-size" /mnt/data/.sourcegraph-size
echo "Done"
exit 0
