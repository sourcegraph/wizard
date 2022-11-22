#!/usr/bin/bash
###############################################################################
# Upgrade Sourcegraph
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
if [ -f /mnt/data/.sourcegraph-version ] && [ -f "$HOME/.sourcegraph-version-new" ]; then
    UPGRADE_VERSION=$(cat "$HOME/.sourcegraph-version-new")
    /usr/local/bin/helm --kubeconfig /etc/rancher/k3s/k3s.yaml upgrade -i -f "$HOME/deploy/install/override.yaml" --version "$UPGRADE_VERSION" sourcegraph sourcegraph/sourcegraph
    sudo mv "$HOME/.sourcegraph-version-new" "$HOME/.sourcegraph-version"
    sudo cp "$HOME/.sourcegraph-version" /mnt/data/.sourcegraph-version
    sudo cp "$HOME/.sourcegraph-size" /mnt/data/.sourcegraph-size
    echo "Done"
    exit 0
else
    echo "Failed"
    exit 1
fi
