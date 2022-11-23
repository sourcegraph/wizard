#!/usr/bin/bash
###############################################################################
# Check if frontend is Ready
###############################################################################
/usr/local/bin/k3s kubectl get deploy/sourcegraph-frontend | grep -q 2/2 && echo 'Ready' && exit 0
