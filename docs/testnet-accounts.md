# Testnet hesapları

Friendbot ile fonlanmış, geliştirme ve demo için kullanılan testnet hesapları. Secret key'ler
yerel makinede Stellar CLI'ın kimlik deposunda (`~/.config/stellar/identity/*.toml`) tutulur —
**repoya asla commit edilmez.** Burada yalnızca public adresler listelenir.

| Alias | Rol | Public Key |
| --- | --- | --- |
| `deployer` | Kontrat deploy eden hesap | `GCIDRR6NMN6WIRWVKIMUSNX4TVLDUR5XDBH2T3E57U57FCKB4IUCLHYJ` |
| `member1` | Test/demo üyesi | `GAMYNYJR2UILL4GXGNPUSFQBMKDBXV2EVLHOIYFH34FTORBY7ULTJHIU` |
| `member2` | Test/demo üyesi | `GBTKI7JP6WXFBBSW6CORWJQIVUCZFKCYU2MAV3552RY4ZZDEOI2AXANG` |
| `member3` | Test/demo üyesi | `GC2F6KCU2QHJXYBSFIWPYX5REDFSOI7ODTK3O2OUJCDIXYJJVT2FHWGC` |
| `member4` | Test/demo üyesi | `GDVUAI3W7WVPBKZZZBLFUDBQFPS7TAZ4T2QJXYEHNVZ4SYLQOF3QLXPM` |
| `member5` | Test/demo üyesi | `GAAEGZZTLWIHEWENYLYZNEO4CBSMMRI7RSZTAQOPCGJ62P6PNEURZO7B` |

Yeniden oluşturmak / fonlamak için:

```bash
stellar keys generate <alias> --network testnet --fund --overwrite
stellar keys public-key <alias>
```

Bu 5 üyelik set, SOW'un Week 4 gereksinimi olan "5 test wallets, 5 complete rounds" demo
döngüsü için ayrılmıştır.
