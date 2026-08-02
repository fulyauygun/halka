# Testnet accounts

Testnet accounts funded via Friendbot, used for development and demos. Secret keys are kept in
the local Stellar CLI identity store (`~/.config/stellar/identity/*.toml`) on the developer's
machine — **never committed to the repo.** Only public addresses are listed here.

| Alias | Role | Public Key |
| --- | --- | --- |
| `deployer` | Contract-deploying account | `GCIDRR6NMN6WIRWVKIMUSNX4TVLDUR5XDBH2T3E57U57FCKB4IUCLHYJ` |
| `member1` | Test/demo member | `GAMYNYJR2UILL4GXGNPUSFQBMKDBXV2EVLHOIYFH34FTORBY7ULTJHIU` |
| `member2` | Test/demo member | `GBTKI7JP6WXFBBSW6CORWJQIVUCZFKCYU2MAV3552RY4ZZDEOI2AXANG` |
| `member3` | Test/demo member | `GC2F6KCU2QHJXYBSFIWPYX5REDFSOI7ODTK3O2OUJCDIXYJJVT2FHWGC` |
| `member4` | Test/demo member | `GDVUAI3W7WVPBKZZZBLFUDBQFPS7TAZ4T2QJXYEHNVZ4SYLQOF3QLXPM` |
| `member5` | Test/demo member | `GAAEGZZTLWIHEWENYLYZNEO4CBSMMRI7RSZTAQOPCGJ62P6PNEURZO7B` |

To regenerate / re-fund:

```bash
stellar keys generate <alias> --network testnet --fund --overwrite
stellar keys public-key <alias>
```

This 5-member set is reserved for the SOW's Week 4 requirement of a "5 test wallets, 5 complete
rounds" demo cycle.
