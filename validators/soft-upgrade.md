## FUJI Soft Upgrade

> upgrading Node-CLI or changing environment variables

**Download new version node CLI**
Make sure th `VERSION_NUM` is the latest version provided here= [versions](/validators/versions)
For `RELEASE` parameter use the `develop` CLI versions use `develop` , for the `beta` CLI versions use `beta` , for the `stable` CLI versions use `stable`

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://skale-cli.sfo2.cdn.digitaloceanspaces.com/[RELEASE]/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale" 
```

**Binary executable**
```bash
chmod +x /usr/local/bin/skale
```

**Check your main environment variables and update with the new stream =**[versions](/validators/versions)
```bash
cd  ~ && vi .env
```

**Perform update**
```bash
skale node update .env
```
