// @name 红果短剧
// SPDX-License-Identifier: GPL-3.0-only
// App source signing / Spade algorithms adapted from jackotom/hongguo-drama
// 5a12c8840ec54fe1a7b10d0519cf64b4875b1983 and woshishiq1/drpys
// 22261adfa31435e3b3ef5a730b8a2a75bcaf1715 via N3urda/hongguoTV.
// Portable JavaScript; baiPlay handles generic MP4 CENC media descriptions.
// No external service, Node.js runtime, captured device ID, or account required.

const SOURCE_ID = 'baiplay_hongguo_shortdrama';
const SOURCE_NAME = '红果短剧';
const SITE = 'https://hongguoduanju.com';
const USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const IMAGE_HEADERS = { 'User-Agent': USER_AGENT, Referer: SITE + '/' };
const LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAYAAAAUg66AAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABIKADAAQAAAABAAABIAAAAACIiAe3AAArzklEQVR4Ae2dC5wU1ZX/z62q7h4YHFBeym4URcD3CzXg+4XiCxlCqyDKX6MmfpLNbv7439W4uhvdRBPjxv9/k3U3f1ejvNRxATUiAgHBiEbFN/LwARIF5aEwMDDTXVV3z6mZgZ6ZnpnurqruurfO+Xz60zXVVbfu/d5Tv7l1695zBcTM6mtr+0LKHG4YcKgQYrAr5WBDiAGIoa8E6IfffUDIlJAihdtJEGDGDBEXN0gCEhxMLiOFbAIpmnB7uwDYit/b0Pc2o++tl1Kud11YB03Ompo5c7YFefmop4Us9LX6iZf3A7PqNAPkaQDieCHhOBSUQfqWmEumPAEJG6WA9wDkuy6I5eA0Lq+Z9RwJlpamlQBtTqd7VaXgPGyyjJESzhMChmtZa1yoWBFAX16DvrwYm1LzG5tg8YC6ul26AFBegOiRyqw2ayWIK7GFcza2cJK6VA6Xgwl0ICDpcQ6WCpBPOQ3OHNUf2ZQUoJXpdPLglDtOgHG9kPICEMLqUFG8gwnoTkBKWwqxSIL76IYmY+7RdXUZ1YqslABtv2rcEMuybsH+nCnYJKUOYzYmwASQAD6mYT+RfMy27Yf6PDn3E1WgKCFA9RPTo0wTpiLUWvwYqsDlfDKBChBw8ZpzHAceqJlV92oFrl/UJSMtQPWTJ5xpgLgHM3l2UaXig5kAEwAcVrLUBXlnzfSnX44qjkgK0I5rxp9iCvNnmLnRUQXH+WICqhBAIVroSOeO3jNmvxG1PEdKgLZcPXZQDyt5L77NuhY7liOVt6hVHOeHCRRFAEc74tuzaXvszO39n3h2Y1HnhnhwJG7yJeecY50yqN9UYYg7sazVIZaXk2YCcSfQIF15zxsbtz5w7ksv2ZWGUXEBapiUHoHK/DC2d06oNAy+PhOICwF8a/YOPmncWD2zbkUly1wxAXpzxIjEEUccdjdm4P/wfKtKugBfO7YEcJ4a9g/dv3r1p3edvGJFthIcKiJA9VfVDjMtayYKz4hKFJqvyQSYQA4BCSsc255U8+SctTl7y7JZ9jE1uyalrzUT1lssPmWpX74IE+ieADYE6J6ke7P7g4M9omwtIHrkOvKIQ3+Nb7d+EGwRODUmwAQCIyDlb1etXvfjcj2SlUWAdqbT/Y2UnItTKDAsBhsTYAKRJiDhFTcDtfvV1W0JO5+hC1D95PRwU8p52PI5LOzCcPpMgAkEREDKTx0hLqmZXrcmoBTzJhNqH5A3lULCqyw+ednzTiYQXQLYYDDw3qV7OMxMhtYC2jUxPUYYMBs7m3uEWQBOmwkwgRAJSNgjXRjfa1bd/DCuEkoLqP6adC2KzzMsPmFUGafJBMpIABsQdC/TPR3GVQNvAVFGTYzWho9dHCQsjBrjNJlAJQhg8DMHo47WzKibE+TlAxWglscuavlwWNQga4nT2kegdx8wDhoEYsAAMPoPAFHTB6B3bxC99gORQrdLVQFg8CjPcL4BZLMgGxsBmhpB7toJcseO5s/nG8BZsxqgQZvwyvsYhbVF4WBduCLIx7HABIg6q0wpXuTHrrBqP4bp9ugJxtBhYA4/AowhQ8E4+BAQ+9UEBkKiODl/WgqZJ2YA7G4ILF2tE8I+IUfIi4KKMRSIANGrduoxxwml+2sNnwsXOgEx6K/AHHEqmMef6ImPwAXcwjb366+h6b67QW6KTJSKsIvsK31sWH7jChgVxCt63wLkDTJMytf4VbuvOo33yTW9wTrrHLBGneG1cioBg0So8Se38iNZofBxnJCbESP9Dlb0JUDe9IojD32JRzgXWmt8XC4B4/BhYI25FFs8p4CwKv/Owl6yCDKP/C43i7zdFQEcMb1q9afn+pm24UuAGq6Z8Bts+fDcrq4qiX/rQMA4+lhI1E7Avp0jO/xWyR0yk4E9P/o+t4KKqQScO1Y94+kfFnNK7rElCxDNnMXxAY/nJsbbTKArAuKQwZCceC2YKEBRtaYH7wdnxRtRzV4k84Vvxq7rNbNuWimZK6mHj+L5oPg8VMoF+ZwYEujZExJTvgtVd98XafGhmhEDD4phBfkrMmkBaUIpqRQtQNTv4wUT49jNpfCO3TkGvs3q8YtfQ+KCi6Acb7T8A8axQ2zFEqgmTSBtKPbEogWIwqjiWB+OZFgs6bgdn0hA4vqboOrW20H0UWd0hvxyU9xqKpjyoiZ42lBkakX1AVEAeRSfP+OnZahpkVfjw2NBQOAI5dSPpoIx+FClyksDE/f8zfe4E7rUWsMY07ga4reLCXRfcAuIls6h1StYfEqtnXicRyOXq376c+XEh2qHRkXz1AwffooNE9II0opCUylYgLx1u3jpnEK5xvI4GsGcuu2uQKdLlAskDUT0pmSU64KaXoeW1yKtKLR4BT2C0YqlPa0URcyvLjRhPi5eBMyRp0Py+z8E0ToRVKHi81SMwCurYbfdNKyQFVgLairRcsmYRRafwOtJjwTNU0ZC8pa/UeQt1z7mNPDQeWUZZJ6cyY9e+7AEsVXdohlTukus2xbQjmvGn2KBgR3P2LhiYwLtCBjHHAepqbeVdSqFbGoC9y+fgbvhM5Bbt2B4je0gt+MHQ21Q+A3AkXFAoTjog+E5RK9ezZ/qXgA9KECnAPnVJnBWr2LhaVefgf2JS9Hb4H6794zZXY7q7LYFZArzZ16NBZYzTkgXAjRzPfWj/x26+FA8H2fl++C++zaKxofgvSoncSnQCj+ywAT5sO4JYIPFBE87Luzq4C5bNTsnjT/LMMylXSXAv8WUAI5urvrpfWAceGAoAKTrgvPWm2C/9EdwUXzAtkO5DicaLgF8L39WV7GDumwBCcO8O9zsceqqEkjeeEso4iMbGsBe8ALQzHT5zdeq4uF8txAwQNyDm+d0BqTTFlD9xPQofKGxvLMTeX98CVjnXgDJG24OFAANArQXvQjZZ2Zzv0ygZCufmOPAaTWz6l7Nl5NOW0AoPgW/y8+XMO/Tk4Do2w8Sk64LtHDOqpWQ+d2/ex3KgSbMiUWCQIuWTMiXmbwtoO1XjRuSSCRo3E/BAxXzJc779CNAb7zME04KpGAS+3WydbPAnvdcIOlxIpEl4Gaz2WF9npz7Sfsc5hUYy7JuwQPz/tY+Af47PgQMFJ7AxAdfmTfd/Y8sPvFwH6NFUzqUtoPIrEynkzhOYkqHI3lHvAlgcPhkQI9e7pdfQuNP7wB33afxZhqr0ospzdrSttAdBOjglDsOhxz2a3sY/xV3AuYZZ3vrcfnl4H7xOTRiy0du2ew3KT5fIQKkKaQt7bPcQYAEGNe3P4j/jjkBDHmXGOt/ZV65/Rtouv/nADvrYw40nsXPpy1tBKi+travkPKCeOLhUndGwPz2SDAG+htwSKOZG391L8htWzu7DO/XnABpC2lMbjHbCJDZ0xiPc746fTWfeyJvx4eANXqM78Jmpv8e5GfrfafDCShMALXFrDbbNKXbCJAURlrh4nHWQyAgvnUwmMOO8JWy885b4Cxd7CsNPlkPAhLElbkl2StAm9PpXkLC2bk/8jYTsLDz2Y/J3buh6eH/8JMEn6sRAdIY0prWIu0VoKoUnIdRCvAVPBsTaCGAry7MUaf7wpF9/lkADJfBxgQ8Aqgxnta04Njb34NR5v0/6DPjwglgbBrq2BV9++KnX/MH10iHZBIEfiCVArBwlZNsBgDj31AMHGhqbI57gzFwXIqDs3kzTl/A19khzRQ3hgwFY/8DCi9TuyMpPo/94rx2ewP8E5dzFv0GgBgwAIx+/XEbP336NMcAIn70SSBLG2MEEUMMQAb4kfU7vM5w6hCX27aB+9WXPP8swGrpLqkWrcH/TOjirQdjzJTz887LaD2Av0sngDeCgcsQG4cO8YK102oRdMMEYTSdQf5lAziffATuJx+D+/FHGC9nYxBJg3niSb7Syf7hGU80fSWSc7I4cBAYh6MoDjkcTBRH6p8Kak15EnR3/brmz7pPwF2DwcpI9NkCJ4ChnM5rTdTTnPqJl/czzaotrTv52z8BY/BhYBx7HJjHHg/G0OGB3SiF5Mzd/JUXS4fi6Xg3EsbWKcWq7vlFyatbBLLEDY6+JuE2TzrZ+xgDBpZSjJLOIWF3P1oDzvvvgvv+eyhMPGq7JJCdnOQ4jf1rZj23tbkFJFL+HvQ7uUjcdouDBoF12plgnnYGlPNmac+Zrm2MuRQS+JENu8B5/TWwly7BFtJH7Q/t/O+qHiAOPqTz37v5xVtfHa9ditGjn3X2uWCeOhIEhVGtgFHLyjzyaO8DV04CT9SX/wns5S+D3BRMC7MCxYrOJZs15xlPgPAfzajo5EyxnGAfg3n6mZA4fzS2Fg6LXObpBqb4PfShGMpZDPbl4E3kxU7uIrfGMGy1oWOUavayJcWdiiupmijeiQsvBsOH8BV30cKP9kR93HcggR9qDWX/uBAD2hNH7FdiK5pAi+Y0CxBOPj2+6BRifgItN2yNvghv7NG4DtZ+StCgGzt14/dBpq+GLIbAsP+4oNN+DuqvKtVo1LP74QeFnY79Y9b5F0LikstB9MYOZAWM/tGkvvs9kNgyspcsBHvhi/hy4BsFch6lLDZrjtcCwnfzx+EreLZCCOBNkhg3AaxzcNQCNtNVNLrRkxOv9W767JynvfCn0K6fyE8rxF2zGpcZdbpGg/8CqVWWqJ2gjPC0LxD940mMHQ/WJWMxdvViyM59mocctIfUyd+e5uBvguZmmNUWT9DpBNTe3T2rIXHZFWBddEnza/K9P6i/4W78AjKP/VebVkvVLx8sefZ7Zta0LuP8GEcdA8kp3wUDV9XQyeg1Pw078N7+7W7QqWihlMVpsPtZkDKHh5K6Rola542GBDa3RbWeazOSEFTdfhd2sP4JMtMewTExDSD6Dyi5Br0WUL6zcX2u5HU3gDXqjHy/Kr+Pxm8lLh8H5C/Zp2aCvXih8mUKtQCoPRa2hA8N9SIKJ07jTCj4unn4MIVLUXjWLXx7Zx59LGTw5vHzeOnmeUtEr9KTN3wPH7dwsKXmRv+oktffBBRDKfPo77xxWpoXuaTikfZYuH7Y4JLO1vkkjKKdGH8lWJeOVXKtcz9VQwKRuoki8pZmkmL95D5+4NstCmKfuOCi0hJU+Cxz6DCgsVQ2TkfJzn6q+34xhctaStZJeyxXysEGzvlhayZAjx7JH/wdjrQ9nJGUQMDdtGnvWTTFJPV3t0ZyeMLeTIa8IeifGQZzM6hl+dsHORJkDm9Pe1B8Sn/Yz0lMh01z5OlQ9bNfsvj4qMzWxQRpBHPVPbhyagTHRvkoXsmn0j80z7fQx9iaCZD24Gw+ifGfY94Cwhag95iAI4fZfBLAMUDmyNMg+b0f+upH8pmLSJ4uevSE1A/+FrIoRtmZjwMUsb59JAvkN1OoPZaUom+sn8BSVZD6IT5yBbTWld86Uf18MXAgJM/6WwysGfN/al1UJE2RMQ48CJp+82Cgk3W7uGQkfyLtobH2agw/DQGhOKAvVN11D4tPgGzNI45i8SmAJ/3DI98jH4yx9cG14yUGTYmfUWdz6s67IznvKH61Ec8Se1Nj0Af9jLlSmhxqjyGkiJ0ACZwtnrrjnwOLyaO0E3DmK0qA4kKRL5JPxs1Ie+gRDEPGxccEPnun7vgpGPiKmI0JRIEA+SL5pPC59FEUylJkHpL4CAYYITEmhpMwU//wj2AcUHqY0ZiQ4mKWmQD5ZOq2OwHQR2NjqD2lB3xRjRKGfaiaehs/dqlWbzHKLz2OkY96saxjUu54CJAw8FX7jzEm82ExqVYupqoEyEfJVzEanKpFKCrfsShlYuJkftVelFvwwZUkQK/oyWfjYNoLkHniCEhcfFkc6pLLqBEB8lnyXd1NawGiQV7Jm3+gex1y+TQlQL6r+0BFfQUIn6FpVrvAIFhsTEBFAuS75MM69wdpK0DWhWPAxJUd2JiAygTIh8mXdTUtBYiarYkJV+taZ1yumBEgX9b1UUxLAUpgwHNRVRUzN+Xi6kqAfJl8WkfTToDozYF10sk61hWXKcYEyKd1fCumnQAl0hNj7KZcdJ0J6OjbWgkQhVQ1cCULNiagIwHybfJxnUwfAcLX7onvXKlT3XBZmEAHAp6PazRNQxsBMkdh6wdDbbAxAZ0JkI+Tr+ti2giQNVrfsRK6OBuXIxgCOvm6FgIkDjkUVy8dGkztcipMIOIEyNfJ53UwLQQoMfoiHeqCy8AECiagi8+rL0C4rI456oyCK44PZAI6EPB8Hn1fdVNegMzjTwSRjFVYa9V9jvMfAAHyefJ91U19ATr5VNXrgPPPBEoiYGrg+2oLkGlxpMOSXJdP0oGAeQK2gPAeUNmUFiDj6GNA9OihMn/OOxMomQCtNU/3gMqmtACZw49UmT3nnQn4JqD6PaC0ABlDh/muQE6ACahMQPV7QF0BMgxcZmeIyr7DeWcCvgl49wDeC6qasjkX3zqEg46p6nWc78AIULAyuhdUNWUFyBisx1B0VR2H8x0dAirfC+oK0EGDouMBnBMmUEEChsL3grICJAYeWMEq50szgegQUPleUFeAcOULNibABHDZMIXvBXUFaP/92feYABNAAkLhe0FdAarmFU/57mMCREAofC+oKUCWxTPg+d5jAi0EvGgQeE+oaGoKUDKlImvOMxMIj4Ci94SaAmSa4VUkp8wEVCSg6D2hpgAJoaKLcJ6ZQHgEFL0l1BQgOxteRXLKTEBFAratYq5BTQHKsgAp6W2c6fAIKHpPKCtAUlHg4XkgpxxXAt69oOj9oKYAoafJXTvj6m9cbibQhoDK94KyAgQ7drSpBP6DCcSWwI7tyhZdWQFyt25RFnrUMt74q3vB3fhF1LLF+SmQgLt1a4FHRu8wNYdPIke5TV3oUXMD9923ofH9d8G6YAwkxk9Qemh/1NiWIz8q3wvKtoDkF5+Xo27jcw3XBXvBPNgz9UeQXTgfpOPEp+yKl1Tle0FZAeJHhpDumoZdkH38EWj8ya3gvPdOSBfhZIMkoPK9oK4AbfgMpJRB1iOnlUNAYp9Q0/0/B+4fyoESwU26B1y8F1Q1ZQUI9uwG+eUmVbkrk2+vf+j2qZCZ9nuQ2DpiixYB7x7Ae0FVU1eAkLj78Ueqclcr39w/FNn6Uv0eUFqAnNUrI+sYWmaM+4ciV62q3wNKC5D7IQtQJe6Ivf1D2EekcgdoJdgFfU3V7wGlBUjiYERn7Zqg65TTK5CAi2/JGrl/qEBawR9Gvk/3gMqmtAAReHv+H1Tmr37ec/uHFvD4oXJWqA6+r7wAOW++Du7mr8pZ73ytfASof2gajx/KhyaMfeTz5Puqm/IChIOBsBX0vOr1oE3+uX+oPFXp+bwG4+DUFyCsb3vZSzhGpaE8Nc9XKYgA9w8VhKmkg8jXyed1MC0ECJoawV68UIf60KsM3D8USn16vo4+r4PpIUBYEzZNoFQ0Lq4OjtRlGbh/qEs8xfxIPk6+rotpI0Dym6/BeW25LvWiZTm4f8h/tZKPk6/rYtoIEFVI9gV+Ja+CY+7rH3oUQ+vy/LJi6kw3H9dKgOSG9eCs/KCY+uRjK0XA6x96AfbcivGHePxQQbVAvk0+rpNpJUBUMdkXntOpfvQvS27/0Lscf6irCtfRt7UTIAof4XK0xK78OJK/ef1Dv8L4Qzy/LG/9kE+Tb+tm2gkQVZBuz8m6OV1X5eH+ofx0dPVpLQXIWf4yyPr6/DXJe6NPgPuH2tQR+TL5tI6mpQABrhKZXaTPWAkdHa+gMnH/kIfJ82VFVz7trp71FCAstb1oAchMprvy8+8KEIhz/xD5MPmyrqatAMFObLb+aZmu9RbLcsWxf8jzYfRlXU1fAcIay2KsIF45QzPXbdM/9ILW65eR75IP62xaC5DctFHLV5c6O2TBZfP6hx5tXr9M0/FD9NqdfFhn01qAqOKy83hgos4OrHP/UBx8V3sBcletBHf9Op3vQS4bEtCtf4h8lnxXd9NegKgCdR3EpbtzFl0+jfqH4uKzsRAg58/Lwf1anxAGRd+YcTtB8f4h8lXy2ThYLAQIHAfsBfPiUJ9cxhwCbfqHFJof6Pkq+mwcLB4ChDVpL1kEslGPMJZxcMwgy+j1D/3kVsg8/kjk4w+Rj5KvxsViI0CwezfYSxfHpV65nO0JUP8QhjJtjj8U3fFDno+ir8bF4iNAWKP2i/NAoiOyxZhAm/6haIW3IN8kH42TxUqA5JbNWizmFicHDa2s+KgTtUUMaKFB8tE4mRWnwlJZ7Rf+ANapI+NWbC5vKwHDAOvCiyHxnatAVFW17o3EN/lm3Cx2AuR+vBacj9aCOXRY3Oo69uU1hgyF5PU3gXHI4MixIJ8k34ybxU6AqIJtjBttDp0at7qOb3l79oREehJY548GIUQkOZBPxtFiKUDOm2+Au/krMAYMjGOdx6rM5sjTITl5CojefSJbbvJF8sk4WiwFCF+FgT3/eUhed0Mc6zwWZRYDD4Tk/7oRzGOOi3x5yRfJJ+NosXoLllvB9rKXQDY05O7ibR0IWBZYV3wHqu59QAnxIR8kX4yrxbMFRLXdhCNOFy+ExOXj4lr32pXbOOoYr9VjHDRImbKRD5IvxtXiK0BY4zQy1rr4MhD4X5NNYQI1NZCceB1YZ5ylVCFoHBL5YJwt1nee/AZnHb+2XDnHjbPDti+7ec75kLz6GhDVvdr/FPm/yffIB+NssRYgqniKu6Laf844O2xr2cW3DsYxPTcrPZ4rLjF/Wuss33fsBUhuWA/Oyg/APPqYfHx4X9QIpFKQqE2DNeZSEKYZtdwVnB/yOfK9uFvsBYgcIEsDE1mAIn8vmCeOgMR13wWjX7/I57W7DJLPsQGwAKEX0OoDLgasMv7qr9knIkhAHNAXhecGsEacEsHcFZ8l8jXyOTaA2I4Dal/5WRoMxhYtAjRxdMxlUPWLX2sjPgSYfW2fm3ELqIWF88oykOmJIPCVLlvlCUR54qgfOrIeV+xFX2NrJsAC1OoJ2SxkF82H5PgrW/fwdyUIKDBx1A8W8jFAX2NrJsAClOMJ9qIFkLhsHIhkMmcvb5aLgDnqDEhec12kJ476YSEzGSAfY9tHgAVoHwuAnc3NY+vcC3L38nbIBLyJoxinxzz62JCvVNnkvUcv9DG2fQRYgPax8LZocBiNro1q3Jh22VX7T5o4ii3OxNhaEImE2mXpJvdSSl4gMw8jFqB2UOSmjd4rUvOEk9r9wn8GSUDFiaN+yk+v3cm32NoSYAFqy8P7KzsPByayAOUhE8Aumjg6CSeOnq7WxFG/JSefYutIgAWoIxNwV60E97P1kYwdnCe7yuyivrXEVZOUnDjqBzL5EvkUW0cCPBCxIxNvD//H6gRMCbtp4mjqn/4FkjfcHDvxIVzsS507DbeAOmHj/Hk5uFddA8YBB3RyBO/uloAmE0e7LWcXB7hfY8gX9CW2/AS4BZSfC4DjgL0gXqtUdoailP3miSdD1X2/hsSlY5WetV5K2XPP8XwIfYktPwFuAeXn4u21lyyCxLgJkVvArossV/wn3SaO+gEqcfVV8iG2zgmwAHXOBmD3brCXLobERZd0dRT/RgRo4ihySuBUlqitOFqpCiLfIR9i65wAC1DnbLxf7BfngTV6DAi8wdjyE9B14mj+0ha2V7q49BP6DlvXBFiAuuYDcstmXDTudV5PPh8nmjh6Ja44el50VxzNl+1y7COfId9h65oAC1DXfLxfbYobferIAo6MzyG6Txz1W5PkM2zdE2AB6p4RuB+vBeejtUoHQC+gmAUdEpeJowXB6OQg8hXyGbbuCbAAdc/IO8KmuNFDpxZ4tIaH0cRRXMQxcbn+E0f91h75ClthBFiACuOE/UBvgLv5KzAGDCzwDH0Oi9vEUT81Rz5CvsJWGAEWoMI4AcjmtxrJa68v9Az1j/Mmjk7BiaNnql+WMpXAe/OFvsJWGAF+t1wYJ+8oe+kSkA0NRZyh7qE0cbTHL/8vi08RVUi+QT7CVjgBbgEVzgqgCUe2Ll6I/SDjijlLqWO9FUdx0qh5+DCl8h2FzJJvkI+wFU6ABahwVt6R9sL5YF18GQjslNXKaOIojmKm0cwqrzhaqTqRtg3kG2zFEdDsLiqu8KUcLb9pnt2sU0At86STIXHtDVqsOFpKnQZxDs14J99gK44A9wEVx8s7OjtPr0FmqR//PYtPCX6Qe4puPpFbtjC3WYBKoCs3rAdn5QclnMmn6EiAfIF8gq14AixAxTPzzsjyYLMSyel3GvtC6XXKAlQiO1rlwP3i8xLP5tN0IUA+QL7AVhoBFqDSuHlnZec/7+NsPlUHAuwD/mqRBcgHP1rpUtbzSpc+ECp9KtW9t9qp0qWobOZZgPzwz2Yhu4jHfvhBqPK5Xt2jD7CVToAFqHR23pn2ogUgMxmfqfDpqhGgOqe6Z/NHgAXIHz+AndwM94tQxfO9Ry+sezZ/BFiA/PHzzqaOSCllAClxEioQoLrmzudgaooFKACOcuMX/Co2AI6qJEGv3anO2fwTYAHyz9BLIcsxgAMiGf1kuK6DqyMWoIBYuh9+AO5n6wNKjZOJKgGqY6prtmAIsAAFw9FLJTuPYwEHiDOSSXEdB1stLEAB8qSQDO7XHJIhQKSRSorqluqYLTgCLEDBsQRwHAxK9UKQKXJaESLg1S3WMVtwBFiAgmPppURhOWUjh+UMGGvFk6M69UKuVjwnemWABSjo+ty9GwOTLw46VU6vwgS8OsW6ZQuWAAtQsDy91GhpFuny0iwhoK1IklSX3nI7Fbm63hdlAQqhfuWWzbg43eshpMxJVoIA1SXVKVvwBFiAgmfqpWjzwMSQyJY/Wa7L8JizAIXE1v14LTirPwwpdU62XASoDqku2cIhwAIUDlcv1ezc/w4xdU66HAS4DsOlzAIUIl935fvg8H/PEAmHmzTVHdUhW3gEWIDCY+ulnK17IuQrcPJhEeC6C4vsvnRZgPaxCGWLJi46b68IJW1ONDwCVGc86TQ8vq0pswC1kgjxOzNrGkgewh8i4WCTprqiOmMLn4ABEnhyS8ic5aaNYPNM+ZApB5c81RXVGVvIBFB7qAXEEdVD5kzJZ+c8De5XX5bhSnwJPwSojqiu2MpCIGNIIZvKcqm4XySbgcwjv+PY0RH2A4r1THUEWFds4RMg7cFHMMECFD5r7wrUqcmjassEu4TLUN1wx3MJ4Eo9BbWHHsG2l3o+n1c8gexTszh0a/HYQj/DXb8OqG7YykpguyGE3FbWS8b9Yo4NTf/vAZANu+JOIjLlp7po+rd/xYBydmTyFIeMCICt9Ai2NQ6FjVIZ5eavoOk3D3LIjghUCoXa8OoC64St7AS2Ga6UHGeg7NwB3A/eg+yMxytwZb5kLgGqA6oLtvITIO0x8BlsffkvzVckAvaCeZB9bi7DqBABYk91wFYZAqQ9Br56XF+Zy/NViUD2qZlgv/RHJWG4n/8F6KOiEXNiz1Y5AqQ9Bj4Cr6tcFvjKRCDzX/8JWQxmr5rZr70C9FHNiDUxZ6ssAdIeA5qcNZXNBl+dCGQf/f+Qnf+8MjBkNostt8Xeh7ZVMWJMrNkiQAC1x6iZM2cbzgfjiS8RqI/sjMcgM/33Srwdc15eCrADh5Dhx9uOAL+uskBvu4gtMWaLAAHUHNIebza8FMCvASJQJ5QFWn0h8+CvQEZ4CRjZ0ACZ/94X54i2aV9UjVhmHryfV7aIUAW1ao4nQADy3QjlLfZZcd5+Exrv/IfIjpjOzMRWRH39vnrCbW/fvj2R2XI/W++x5JhMkamSlow0a44nQNg6fTVq2Yt7fmiwYuM//wSyzz8bqUcye+kScJa91KF6aB/9FhWjRy5iRwyJJVu0CLggllOOLC9bsglfZVRFK4ecG3wesyH7xHRwVrwOyetvBuNbB1eUCrUiMo/ibPFOjH4TNTVgnjiikyPKs9v9ywYvn+5Ha8tzQb5K8QScRk+AROuZu65JrxYChrf+zd8RIyAMsEaPgUTtBBC9epU9c/YrL0Pm4Yc8Uezy4pYFyRtvAev0M7s8LIwf5a5dXiwfe+F87FXglWnDYBxEmhj1ZE2vGXVHUFrNLSDcQPGhBc1ZgIhKFA1vKBq1ay9bAomLLwNrzKUgevYMPacyk4Fs3SywCx0igK22zH/8G7jrP4VEeiKIZDL8PGInM+UvS4tBNu4J/Xp8AX8EWrTGS2RvC6h+cnqsCfCMv6T57LIRSFWBdfa5XqvIOPCgUC7rvPMWdi4/XnJ4UnHQIEhOug7ME04KJX/ul5uAWjte31NTYyjX4ESDJ4AxoK+omV73LKW8V4A2p9O9qpOwDfeE/y8r+DLFOkVj6DAwTzsLzJNOBuOAA3yxkNiCobXQaThAUCuCGocPA+uiS8A8+VQQ+Ijmx9yvvwbnrTfBWb4MuI/HD8kKnYtBJxsy0HdAXZ0Xj2avAFF2dk1OL8AdoyuUNb5sAATEwYPBPOIoMIYNAwO3xYCBIExs23Zi9LZIYhxkd+0acD7EhRTffgtgz+5Ojva5u0dP7KA+CcyjjsX8DQcx8EAQRstIkDxJ0+oU9AbL3bAe89e81LXEbTZ1CUiAhb2m113YWoI2AtQwecKN2CjiceqtdHT4Ni0Q2CoSNb0BqqsB6IbHXkDAfhO5sx7kli2VC8RFeevfH8R+NQDUn4WdA4CCCDioUdbvAImtHQ4SpoMT5pZB3lQ9/emHW/e0EaD62tq+Zk/zS3QEf+3k1tT5mwkwASbQSkBK29ntHOhN/2rZ16b9Sz9IIRa1Hs/fTIAJMIGgCJC25IoPpdtGgGiHBPdR+mZjAkyACQRJIJ+2dBCgDU3GXOwi4DjRQZLntJhAzAmQppC2tMfQQYCOrqvDVdnkY+0P5L+ZABNgAqUTkI81a0vbFDoIEP1s2zaOuQcey96WFf/FBJhAaQTcFk3pcHZeAerz5NxP8Mg5HY7mHUyACTCB4gnMadGUDmfmFSA6CseAPdDhaN7BBJgAEyiSQFda0qkA1cyqexWHqy0t8lp8OBNgAkxgLwHSENKSvTvabXQqQHQcDtK/s93x/CcTYAJMoGAC3WlIlwJUM/3pl1HB1FsvpmA8fCATYAJhESDtIA3pKv0uBYhOdKRzB84dwrTYmAATYAIFEkDN8LSjm8O7FaDeM2a/gRHsp3WTDv/MBJgAE9hLgDSDtGPvjk42uhUgOm+Pnbkdv6K77konhePdTIAJVIRAQ4tmdHvxggSo/xPPbpSuvKfb1PgAJsAEYk+AtII0oxAQBQkQJfTGxq0PYE/QO4UkyscwASYQTwKkEaQVhZa+TTyg7k5qmJQegSFb/4yfzkPsdZcI/84EmICeBCRgCEv4dvXMuhWFFrDgFhAlSAnj67D7C02cj2MCTCA+BCTIXxYjPkSmKAGiE1av/vQuVLmCFY7OYWMCTEBzAqgJq1ev+6diS1m0AJ28YkXWse1JeCF+K1YsbT6eCehJoIE0gbSh2OIVLUB0gZon56zFdfJuKfZifDwTYAL6ESAtIE0opWQlCRBdqNfMumk4Qvq3pVyUz2ECTEATAqgBnhaUWJySBYiut2r1uh9j9MTlJV6bT2MCTEBlAhJeadaA0gvhS4Domc9tEuOwJfRp6VngM5kAE1COAN7zbgZqS+n3yS2rLwGihParq9viCHEJDkD6Jjdh3mYCTEBPAnSv0z1P977fEvoWIMoALjS/xhXyCnw9v8dvhvh8JsAEIkwA73G61+meDyKXgQgQZcSLHeTCeBQhXFWDjQkwAe0I4L2Nb7zGdxfjp5hyByZAdNFes+rmOwBXY5+QXUwm+FgmwAQiToCWVcZ7m+7xIHMaqABRxmpm1M1xQFzJLaEgq4nTYgIVJIAtH7qn6d4OOhdFTUYt5uK7JqbHCANm48TVHsWcx8cyASYQIQLY50OPXUG3fFpLGJoA0QXqJ08405DiGSFg/9YL8jcTYAJqEKC3Xc0dzl3HdfZTmlAFiDJWPzk93JRyHghxmJ+M8rlMgAmUkQCO86FX7UG97eos56ELEF14Zzrd30hJXJhenNZZRng/E2ACESGAI5xpkGEQ43y6K1HgndD5LkgFWbVq3Tk8dywfHd7HBCJEAOd2rVr96bnlEB8qdVlaQLl4d01KX4ud0w/hvurc/bzNBJhARQk00Kx2PxNLS8l92QWIMll/Ve0w07JmovyNKCXTfA4TYAIBEsBgYhTPp9SQGn5yUpZHsPYZpIJiM28U9rLfh+OFcHwTGxNgAmUngPce3YN0L1ZCfKi8FWkB5YKmQPe4iNnD+Kr+hNz9vM0EmEB4BFB43hESbiw2hnPQOapICyi3EATgjS+2nIJrCd2G+znMay4c3mYCwRPAvh55G91zlRYfKlrFW0C5fLdcPXZQDyt5LyrztThuKFJ5y80nbzMB5QjgWu20XDKtWFroooHlKGMkb/Id14w/xRTmzzBzo8sBga/BBHQmgEtpLXSkc0cha7WXm0MkBagVws5J488Shnk3ZvLs1n38zQSYQGEEUHiWSte5a7+Zs5cVdkb5j4q0ALXiqJ+YHmWaMBX/rsVPxfutWvPF30wgggRczNMcx4EHambVvRrB/LXJkhIC1Jrj7VeNG2JZFi4HJKZgD1G/1v38zQTiTgDfam3FBSIes237oT5Pzv1EFR5KCVAr1JXpdPLglDtOgHG9kPIC7LC2Wn/jbyYQGwIYJEwKsUiC++iGJmPu0XV1ykUjVVKAch2svra2r9nTGC+Fkca3Z2fje71k7u+8zQS0IkBhUQUsFdKtc3a7s2vmzNmmcvmUF6Bc+JvT6V5VKTjPBBiDTdLz8DFteO7vvM0EVCSAvrwGfXkxThmY39gEiwfU1e1SsRz58qyVALUvYP3Ey/uBSJ1uGDAK+42OxxbScdhCGtT+OP6bCUSGgISN2MJ5D/tz3nVdeBVk0ys1s57D/h09TWsByldl9MgGKXM4itKhONZxsCvlYEOIASBkPxyp1RfP6YPbKSFFCreTKFjYoGJjAiUSaJ7riI9NsgmkaMJUtgsht+H2VvS9zeh763GI4HoUm3XQ5KxR/ZGqWEr/A4WrK4Dl9kukAAAAAElFTkSuQmCC';
const WidgetMetadata = {
  id: SOURCE_ID,
  name: SOURCE_NAME,
  title: SOURCE_NAME,
  version: '2.1.0',
  author: 'baiPlay',
  site: SITE,
  logo: LOGO,
  icon: LOGO,
  description: '红果短剧自定义媒体库，支持推荐、分类、搜索、完整选集和竖屏刷剧；直接取源，由 App 播放，无需另启服务。'
};

const CATEGORY_DEFINITIONS = [
  { id: 'recommended', title: '热门推荐', path: '/category?tab=1&sort_type=1', style: 'discover.spotlight' },
  { id: 'real', title: '真人剧', path: '/category/real-drama', style: 'discover.posterCompact' },
  { id: 'comic', title: '漫剧', path: '/category/comic-drama', style: 'discover.editorial' },
  { id: 'ai', title: 'AI 剧', path: '/category/ai-drama', style: 'discover.posterCompact' }
];

function argsify(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) { return {}; }
  }
  return {};
}

function responseBody(response) {
  // A raw App JSON object also contains data; do not unwrap its model map.
  if (response && response.status === undefined && response.statusCode === undefined
    && (response.code !== undefined || response.Code !== undefined || response.video_info !== undefined)) return response;
  if (response && response.data !== undefined) return response.data;
  if (response && response.body !== undefined) return response.body;
  if (response && typeof response.text === 'string') return response.text;
  return response;
}

async function requestRaw(url, options) {
  const opts = options || {};
  const headers = opts.headers || {};
  let response;
  const api = typeof Widget !== 'undefined' && Widget.http ? Widget.http
    : typeof $http !== 'undefined' && $http ? $http
      : typeof $fetch !== 'undefined' && $fetch ? $fetch : null;
  const method = String(opts.method || 'GET').toUpperCase();
  if (!api || typeof api[method === 'POST' ? 'post' : 'get'] !== 'function') throw new Error('当前小程序环境缺少 HTTP 请求接口');
  const requestOptions = { headers, timeout: opts.timeout || 25 };
  response = method === 'POST'
    ? await api.post(url, opts.body || '', requestOptions)
    : await api.get(url, requestOptions);
  const status = Number(response && (response.status || response.statusCode) || 0);
  if (status >= 400 || response && response.ok === false) {
    throw new Error('红果请求失败（HTTP ' + status + '），请稍后重试');
  }
  return responseBody(response);
}

async function requestText(url, options) {
  const body = await requestRaw(url, options);
  if (typeof body === 'string') return body;
  if (body && typeof body.text === 'function') return await body.text();
  if (body == null) return '';
  return String(body);
}

async function requestJSON(url, options) {
  const body = await requestRaw(url, options);
  let data = body;
  if (typeof body !== 'object' || body === null) {
    try { data = JSON.parse(String(body || '').trim()); } catch (_) { throw new Error('红果返回的数据格式无效'); }
  }
  if (!data || typeof data !== 'object' || data.error) throw new Error('红果接口返回错误，请稍后重试');
  return data;
}

function extractRouterData(html) {
  const text = String(html || '');
  const marker = /(?:window\.)?_ROUTER_DATA\s*=\s*/.exec(text);
  let start = marker ? text.indexOf('{', marker.index + marker[0].length) : -1;
  if (start < 0) {
    const script = /<script\b[^>]*\bid=["']__MODERN_ROUTER_DATA__["'][^>]*>([\s\S]*?)<\/script>/i.exec(text);
    if (script) {
      try { return JSON.parse(script[1]); } catch (_) { throw new Error('红果 SSR 数据解析失败'); }
    }
  }
  if (start < 0) throw new Error('红果页面缺少 SSR 数据');

  let depth = 0;
  let quote = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quote = false;
      continue;
    }
    if (character === '"') quote = true;
    else if (character === '{' || character === '[') depth += 1;
    else if (character === '}' || character === ']') {
      depth -= 1;
      if (depth === 0) {
        try { return JSON.parse(text.slice(start, index + 1)); } catch (_) { break; }
      }
    }
  }
  throw new Error('红果 SSR 数据解析失败');
}

async function siteRouter(path) {
  const html = await requestText(SITE + path, { headers: { 'User-Agent': USER_AGENT } });
  return extractRouterData(html);
}

function numericId(value) {
  // Hongguo IDs exceed JavaScript's safe integer range; never coerce them to numbers.
  if (typeof value === 'number' && !Number.isSafeInteger(value)) return '';
  const text = String(value == null ? '' : value).trim();
  return /^\d{1,30}$/.test(text) ? text : '';
}

function cleanTags(value) {
  if (Array.isArray(value)) return value.map((item) => String(item && typeof item === 'object' ? item.name || '' : item || '').trim()).filter(Boolean);
  if (value == null) return [];
  return String(value).split(/[、,，|]/).map((item) => item.trim()).filter(Boolean);
}

function unwrapCard(value) {
  if (!value || typeof value !== 'object') return {};
  return value.video_data || value.series || value;
}

function cardId(raw) {
  const value = unwrapCard(raw);
  return numericId(value.series_id || value.id || value.keyword || value.url);
}

function mediaCard(raw) {
  const value = unwrapCard(raw);
  const id = cardId(value);
  if (!id) return null;
  const title = String(value.series_name || value.series_title || value.title || value.name || '红果短剧');
  const cover = String(value.series_cover || value.cover || value.pic || value.img || '');
  const episodeCount = Number(value.episode_cnt || (value.series_episode_info && value.series_episode_info.episode_total_cnt) || 0);
  const tags = cleanTags(value.tags || value.tname || value.category_list && value.category_list.map((tag) => tag.name));
  const badge = String(value.episode_right_text || value.badge || value.desc || '').trim();
  const badges = tags.slice(0, 4);
  if (badge) badges.unshift(badge);
  if (episodeCount && !badges.some((item) => /集/.test(item))) badges.push('全' + episodeCount + '集');
  return {
    id,
    title,
    subtitle: badge || (episodeCount ? '全' + episodeCount + '集' : '红果短剧'),
    type: 'series',
    poster: cover,
    backdrop: cover,
    imageHeaders: IMAGE_HEADERS,
    posterHeaders: IMAGE_HEADERS,
    backdropHeaders: IMAGE_HEADERS,
    overview: String(value.series_intro || value.description || value.content || '').trim(),
    badges,
    aspectRatio: '2:3',
    providerIds: {
      HongguoSeriesId: id,
      HongguoFirstEpisodeId: numericId(value.vid_list && value.vid_list[0] || value.episodes && value.episodes[0] && value.episodes[0].id)
    },
    action: { type: 'detail', itemId: id, title }
  };
}
function mapCards(list) {
  const seen = {};
  return (Array.isArray(list) ? list : []).map(mediaCard).filter((item) => {
    if (!item || seen[item.id]) return false;
    seen[item.id] = true;
    return true;
  });
}

function pageNumber(value) {
  const page = Number(value || 1);
  return Number.isFinite(page) ? Math.min(100, Math.max(1, Math.floor(page))) : 1;
}

function paginationInfo(value, page, itemCount) {
  const pagination = value && value.pagination;
  const totalPages = Number(pagination && pagination.totalPages);
  const current = Number((pagination && pagination.pageNum) || page || 1);
  return {
    page: current,
    hasMore: current < 100 && (totalPages ? current < totalPages : itemCount >= 20)
  };
}

async function siteCategory(path, page) {
  const query = path.indexOf('?') >= 0 ? '&page=' + page : '?page=' + page;
  const data = await siteRouter(path + query);
  const loader = data.loaderData || {};
  const pageData = loader.category_$ || loader.category_page || {};
  const items = mapCards(pageData.recommendList);
  if (!Array.isArray(pageData.recommendList)) throw new Error('红果分类数据暂不可用');
  const pagination = paginationInfo(pageData, page, items.length);
  return { items, page: pagination.page, hasMore: items.length > 0 && pagination.hasMore };
}

async function loadCategory(path, ctx, page) {
  return await siteCategory(path, page);
}

function categoryDefinition(pageId) {
  const aliases = { home: 'recommended', 'rank-hot': 'recommended', 'rank-real': 'real', 'rank-comic': 'comic', 'rank-ai': 'ai' };
  const id = aliases[pageId] || pageId;
  return CATEGORY_DEFINITIONS.find((item) => item.id === id);
}

async function loadSearch(query, ctx, page) {
  // The website's SSR search ignores page=N and repeats its first ten rows.
  if (page > 1) return { items: [], page, hasMore: false };
  const data = await siteRouter('/search/' + encodeURIComponent(query));
  const loader = data.loaderData || {};
  const pageData = loader['search_(keyword)/page'] || loader.search_page || {};
  if (!Array.isArray(pageData.searchList)) throw new Error('红果搜索数据暂不可用');
  return { items: mapCards(pageData.searchList), page, hasMore: false };
}

async function loadSeries(id, ctx) {
  const data = await siteRouter('/detail?series_id=' + encodeURIComponent(id));
  const series = data && data.loaderData && data.loaderData.detail_page && data.loaderData.detail_page.seriesDetail;
  if (!series || numericId(series.series_id) !== id || !Array.isArray(series.vid_list) || !series.vid_list.length || series.vid_list.length > 2000) throw new Error('红果剧集暂无有效分集');
  if (series.vid_list.some(value => !numericId(value)) || new Set(series.vid_list).size !== series.vid_list.length) throw new Error('红果分集数据无效');
  return series;
}

function episodeList(series) {
  if (Array.isArray(series.episodes)) {
    return series.episodes.map((episode, index) => ({
      id: numericId(episode.id),
      title: String(episode.title || '第 ' + (episode.number || index + 1) + ' 集'),
      number: Number(episode.number || index + 1)
    })).filter((episode) => episode.id);
  }
  return (Array.isArray(series.vid_list) ? series.vid_list : []).map((id, index) => ({
    id: numericId(id),
    title: '第 ' + (index + 1) + ' 集',
    number: index + 1
  })).filter((episode) => episode.id);
}

function episodeIdFrom(ctx) {
  const input = argsify(ctx);
  const ext = input.ext && typeof input.ext === 'object' ? input.ext : {};
  const explicit = input.episodeId || ext.episodeId || input.episode;
  if (explicit) {
    const id = numericId(explicit);
    if (!id) throw new Error('红果分集 ID 无效');
    return id;
  }
  const version = String(input.versionId || input.sourceId || '');
  if (version) {
    // Some official cards omit episodes; identify the series until the
    // active card resolves its first episode, rather than loading every detail.
    if (/^hongguo-first:\d{1,30}$/.test(version)) return '';
    const match = /^hongguo-(?:app|bridge):(\d{1,30})$/.exec(version);
    if (!match) throw new Error('红果播放版本无效');
    return match[1];
  }
  return '';
}

async function firstEpisodeId(ctx) {
  const input = argsify(ctx);
  const explicit = episodeIdFrom(input);
  if (explicit) return explicit;
  const firstVersion = /^hongguo-first:(\d{1,30})$/.exec(String(input.versionId || input.sourceId || ''));
  const seriesId = firstVersion ? firstVersion[1] : numericId(input.itemId || input.seriesId || input.id);
  if (!seriesId) return '';
  const series = await loadSeries(seriesId, input);
  const episodes = episodeList(series);
  return episodes[0] ? episodes[0].id : '';
}

async function publicPreview(ctx, episodeId) {
  const input = argsify(ctx);
  const firstVersion = /^hongguo-first:(\d{1,30})$/.exec(String(input.versionId || input.sourceId || ''));
  const seriesId = firstVersion ? firstVersion[1] : numericId(input.itemId || input.seriesId || input.id);
  if (!seriesId) return null;
  const path = '/player/' + seriesId + '/' + episodeId;
  try {
    const data = await siteRouter(path);
    const loader = data && data.loaderData || {};
    const player = loader['player_(series_id)/(vid)/page'];
    const preview = player && player.publicVideoSeo;
    // Public playback is exposed only for specific episodes (currently the first
    // three in sampled series). Never infer availability from the episode number.
    if (!preview || preview.available !== true
      || preview.seriesId !== seriesId || preview.itemId !== episodeId) return null;
    return {
      url: SITE + '/video/public/' + episodeId + '/360p.mp4',
      container: 'mp4',
      headers: { 'User-Agent': USER_AGENT, Referer: SITE + path },
      isLive: false,
      streamKind: 'vod'
    };
  } catch (_) { return null; }
}

function getManifest() {
  return Object.assign({}, WidgetMetadata, {
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      resourceVersions: true,
      playback: true,
      shortFeed: true,
      aggregation: true,
      playbackHistory: true,
      resourceMatching: false
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    },
    parameters: []
  });
}

function feedEntry() {
  return {
    id: SOURCE_ID + ':feed',
    title: '刷短剧',
    subtitle: '上下滑动连续看红果短剧',
    type: 'collection',
    poster: LOGO,
    backdrop: LOGO,
    badges: ['竖屏', '短剧'],
    action: {
      type: 'category',
      pageId: 'feed',
      title: '刷短剧',
      presentation: 'shortFeed',
      itemAspectRatio: '9:16'
    },
    providerIds: { MiniLibraryPresentation: 'shortFeed' }
  };
}

async function getHome(ctx) {
  let hot = { items: [], page: 1, hasMore: true };
  let subtitle = '';
  try { hot = await loadCategory(CATEGORY_DEFINITIONS[0].path, ctx, 1); } catch (_) { subtitle = '推荐内容暂不可用，请稍后重试'; }
  const items = hot.items || [];
  return {
    pageType: 'home',
    id: SOURCE_ID + ':home',
    title: SOURCE_NAME,
    heroAspectRatio: '2:3',
    hero: items.slice(0, 6),
    sections: [
      {
        id: SOURCE_ID + ':recommended',
        title: '热门推荐',
        subtitle,
        style: 'discover.spotlight',
        itemAspectRatio: '2:3',
        moreAction: { type: 'category', pageId: 'recommended', title: '热门推荐', itemAspectRatio: '2:3' },
        loadAction: { type: 'custom', id: SOURCE_ID + ':recommended', title: '热门推荐' },
        promotesToHero: true,
        items: items.slice(0, 18),
        lazy: items.length === 0
      },
      {
        id: SOURCE_ID + ':feed',
        title: '竖屏刷剧',
        style: 'discover.annualWidePreview',
        items: [Object.assign(feedEntry(), { previewItems: items.slice(0, 3) })]
      }
    ].concat(CATEGORY_DEFINITIONS.slice(1).map((category) => ({
      id: SOURCE_ID + ':' + category.id,
      title: category.title,
      style: category.style,
      itemAspectRatio: '2:3',
      moreAction: { type: 'category', pageId: category.id, title: category.title, itemAspectRatio: '2:3' },
      loadAction: { type: 'custom', id: SOURCE_ID + ':' + category.id, title: category.title },
      lazy: true,
      items: []
    })))
  };
}

async function getHomeSection(ctx) {
  const input = argsify(ctx);
  const rawId = String(input.sectionId || input.id || '').replace(SOURCE_ID + ':', '');
  const category = CATEGORY_DEFINITIONS.find((item) => item.id === rawId);
  if (!category) {
    return { id: input.sectionId || input.id || SOURCE_ID + ':empty', title: input.title || SOURCE_NAME, style: input.style || 'discover.standard', lazy: false, items: [] };
  }
  let result = { items: [] };
  let subtitle = '';
  try { result = await loadCategory(category.path, input, 1); } catch (_) { subtitle = category.title + '暂不可用，请稍后重试'; }
  return {
    id: SOURCE_ID + ':' + category.id,
    title: category.title,
    subtitle,
    style: category.style,
    itemAspectRatio: '2:3',
    moreAction: { type: 'category', pageId: category.id, title: category.title, itemAspectRatio: '2:3' },
    lazy: false,
    promotesToHero: category.id === 'recommended',
    items: result.items || []
  };
}

async function getCategory(ctx) {
  const input = argsify(ctx);
  const pageId = String(input.pageId || input.id || 'recommended');
  const page = pageNumber(input.page);
  if (pageId === 'feed' || pageId === 'shortFeed') {
    const base = await loadCategory(CATEGORY_DEFINITIONS[0].path, input, page);
    // Official cards usually carry their first vid. Missing IDs defer detail to the
    // active item's resolvePlayback, keeping entry to the feed to one list request.
    const episodes = (base.items || []).map((item) => {
      const episodeId = numericId(item.providerIds && item.providerIds.HongguoFirstEpisodeId);
      return Object.assign({}, item, {
        id: item.id + ':first',
        subtitle: '第 1 集',
        type: 'episode',
        action: {
          type: 'play',
          itemId: item.id,
          seasonId: 's1',
          episodeId: episodeId || undefined,
          versionId: episodeId ? 'hongguo-app:' + episodeId : 'hongguo-first:' + item.id,
          title: item.title + ' 第 1 集'
        },
        episodeId: episodeId || undefined,
        aspectRatio: '9:16'
      });
    });
    return { pageType: 'shortFeed', id: 'feed', title: input.title || '刷短剧', itemAspectRatio: '9:16', page, hasMore: base.hasMore, items: episodes };
  }
  const category = categoryDefinition(pageId);
  if (!category) return { pageType: 'category', id: pageId, title: input.title || SOURCE_NAME, itemAspectRatio: '2:3', page, hasMore: false, items: [] };
  let result;
  try { result = await loadCategory(category.path, input, page); } catch (_) {
    throw new Error(category.title + '暂不可用，请检查网络后重试');
  }
  return {
    pageType: 'category',
    id: pageId,
    title: input.title || category.title,
    style: category.style,
    itemAspectRatio: '2:3',
    page: result.page || page,
    hasMore: result.hasMore === true,
    items: result.items || []
  };
}

async function getDetail(ctx) {
  const input = argsify(ctx);
  const id = numericId(input.itemId || input.id || input.seriesId);
  if (!id) throw new Error('缺少红果剧集 ID');
  const series = await loadSeries(id, input);
  const episodes = episodeList(series);
  if (!episodes.length) throw new Error('红果剧集暂无有效分集');
  const card = mediaCard(series) || { id, title: '红果短剧', poster: '', backdrop: '', overview: '', badges: [] };
  const firstVisibleTime = Number(series.first_visible_time || 0);
  const firstVisibleYear = firstVisibleTime > 0 ? new Date(firstVisibleTime * 1000).getUTCFullYear() : 0;
  const cast = Array.isArray(series.celebrities) ? series.celebrities.map((person) => ({
    id: String(person.celebrity_id || person.nickname || ''),
    name: String(person.nickname || ''),
    character: String(person.sub_title || '').replace(/^饰\s*/, ''),
    avatar: String(person.avatar || ''),
    imageHeaders: IMAGE_HEADERS
  })).filter((person) => person.name) : [];
  return {
    pageType: 'detail',
    id,
    title: card.title,
    type: 'series',
    poster: card.poster,
    backdrop: card.backdrop,
    imageHeaders: IMAGE_HEADERS,
    posterHeaders: IMAGE_HEADERS,
    backdropHeaders: IMAGE_HEADERS,
    detailImageAspectRatio: '2:3',
    overview: card.overview,
    year: Number.isFinite(firstVisibleYear) && firstVisibleYear > 0 ? firstVisibleYear : undefined,
    genres: cleanTags(series.tags),
    badges: card.badges,
    providerIds: { HongguoSeriesId: id },
    cast,
    facts: [{ title: '集数', value: '全 ' + episodes.length + ' 集' }],
    seasons: [{
      id: 's1',
      title: '全集',
      seasonNumber: 1,
      episodes: episodes.map((episode) => ({
        id: episode.id,
        title: episode.title,
        episodeNumber: episode.number,
        action: { type: 'play', itemId: id, seasonId: 's1', episodeId: episode.id, title: card.title + ' ' + episode.title }
      }))
    }]
  };
}

async function getResourceVersions(ctx) {
  const input = argsify(ctx);
  const itemId = numericId(input.itemId || input.seriesId || input.id);
  const episodeId = await firstEpisodeId(input);
  if (!episodeId) throw new Error('缺少红果分集 ID');
  const version = {
    id: 'hongguo-app:' + episodeId,
    title: '红果播放',
    name: '红果播放',
    subtitle: '自动清晰度 · App 直接播放',
    container: 'mp4',
    availability: 'requiresResolve',
    default: true,
    ext: { episodeId },
    action: { type: 'play', itemId: itemId || undefined, seasonId: input.seasonId || 's1', episodeId, versionId: 'hongguo-app:' + episodeId }
  };
  return [{ id: 'hongguo-app', title: '红果播放', versions: [version] }];
}

async function resolvePlayback(ctx) {
  const input = argsify(ctx);
  const episodeId = await firstEpisodeId(input);
  if (!episodeId) throw new Error('缺少红果分集 ID');
  try {
    // Resolve again on retry because CDN assignments expire. Content keys remain
    // in this playback description and are never persisted in source parameters.
    const resolved = await HGAppSource.fetchAppPlayUrl(episodeId);
    const variants = resolved.variants || [resolved];
    const primary = variants[0];
    const headersFor = value => ({ 'User-Agent': value.userAgent, Referer: value.referer });
    const result = {
      url: primary.url,
      container: 'mp4',
      headers: headersFor(primary),
      isLive: false,
      streamKind: 'vod'
    };
    if (primary.contentKey) {
      result.mp4Cenc = { key: primary.contentKey };
      const fallbacks = variants.slice(1)
        .filter(value => /^[a-f\d]{32}$/i.test(value.contentKey || ''))
        .slice(0, 7)
        .map(value => ({ url: value.url, headers: headersFor(value), key: value.contentKey }));
      if (fallbacks.length) result.mp4Cenc.fallbackSources = fallbacks;
    }
    return result;
  } catch (_) {
    const preview = await publicPreview(input, episodeId);
    if (preview) return preview;
    throw new Error('红果本集片源暂不可用，且没有可直接播放的官网公开片源，请稍后重试');
  }
}

async function search(ctx) {
  const input = argsify(ctx);
  const query = String(input.query || input.keyword || input.text || '').trim();
  const page = pageNumber(input.page);
  if (!query) return { pageType: 'search', title: '搜索红果短剧', page, hasMore: false, items: [] };
  let result;
  try { result = await loadSearch(query, input, page); } catch (_) {
    throw new Error('红果搜索暂不可用，请检查网络后重试');
  }
  return { pageType: 'search', title: '搜索：' + query, page: result.page || page, hasMore: result.hasMore === true, items: result.items || [] };
}



// Protocol adapter and portable binary / crypto implementation.
const HGAppSource = (function () {
// Binary utilities stay inside this adapter; the host needs no Node.js globals.
class HGBytes extends Uint8Array {
  static from(value, encoding) {
    if (typeof value !== 'string') return new HGBytes(value);
    const kind = String(encoding || 'utf8').toLowerCase();
    if (kind === 'hex') {
      if (!/^(?:[\da-f]{2})*$/i.test(value)) throw new Error('无效的十六进制数据');
      return new HGBytes((value.match(/../g) || []).map(item => parseInt(item, 16)));
    }
    if (kind === 'base64' || kind === 'base64url') {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const source = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '').replace(/=+$/, '');
      if (source.length % 4 === 1 || /[^A-Za-z0-9+/]/.test(source)) throw new Error('无效的 Base64 数据');
      const out = []; let bits = 0; let count = 0;
      for (let i = 0; i < source.length; i++) { bits = (bits << 6) | alphabet.indexOf(source[i]); count += 6; if (count >= 8) { count -= 8; out.push((bits >>> count) & 255); } }
      return new HGBytes(out);
    }
    if (kind === 'ascii') return new HGBytes(Array.from(value, item => item.charCodeAt(0) & 127));
    const encoded = encodeURIComponent(value); const out = [];
    for (let i = 0; i < encoded.length; i++) { if (encoded[i] === '%') { out.push(parseInt(encoded.slice(i + 1, i + 3), 16)); i += 2; } else out.push(encoded.charCodeAt(i)); }
    return new HGBytes(out);
  }
  static alloc(length, fill) { const out = new HGBytes(length); if (fill) out.fill(fill); return out; }
  static concat(values) { const out = HGBytes.alloc(values.reduce((sum, value) => sum + value.length, 0)); let at = 0; for (const value of values) { out.set(value, at); at += value.length; } return out; }
  static isBuffer(value) { return value instanceof Uint8Array; }
  copy(destination, at) { destination.set(this, at || 0); }
  readUInt32LE(at = 0) { return (this[at] | this[at + 1] << 8 | this[at + 2] << 16 | this[at + 3] << 24) >>> 0; }
  readUInt32BE(at = 0) { return (this[at] << 24 | this[at + 1] << 16 | this[at + 2] << 8 | this[at + 3]) >>> 0; }
  writeUInt32LE(value, at = 0) { for (let i = 0; i < 4; i++) this[at + i] = value >>> (8 * i); }
  writeUInt32BE(value, at = 0) { for (let i = 0; i < 4; i++) this[at + i] = value >>> (24 - 8 * i); }
  readBigUInt64LE(at = 0) { return BigInt(this.readUInt32LE(at)) | BigInt(this.readUInt32LE(at + 4)) << 32n; }
  readBigUInt64BE(at = 0) { return BigInt(this.readUInt32BE(at)) << 32n | BigInt(this.readUInt32BE(at + 4)); }
  writeBigUInt64LE(value, at = 0) { this.writeUInt32LE(Number(value & 0xffffffffn), at); this.writeUInt32LE(Number(value >> 32n & 0xffffffffn), at + 4); }
  writeBigUInt64BE(value, at = 0) { this.writeUInt32BE(Number(value >> 32n & 0xffffffffn), at); this.writeUInt32BE(Number(value & 0xffffffffn), at + 4); }
  writeFloatLE(value, at = 0) { const view = new DataView(new ArrayBuffer(4)); view.setFloat32(0, value, true); for (let i = 0; i < 4; i++) this[at + i] = view.getUint8(i); }
  toString(encoding) {
    const kind = String(encoding || 'utf8').toLowerCase();
    if (kind === 'hex') return Array.from(this, value => value.toString(16).padStart(2, '0')).join('');
    if (kind === 'ascii') return Array.from(this, value => String.fromCharCode(value & 127)).join('');
    if (kind === 'base64' || kind === 'base64url') {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; let out = '';
      for (let i = 0; i < this.length; i += 3) { const a = this[i]; const b = this[i + 1]; const c = this[i + 2]; out += alphabet[a >>> 2] + alphabet[((a & 3) << 4) | ((b || 0) >>> 4)] + (i + 1 < this.length ? alphabet[((b & 15) << 2) | ((c || 0) >>> 6)] : '=') + (i + 2 < this.length ? alphabet[c & 63] : '='); }
      return kind === 'base64url' ? out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : out;
    }
    return decodeURIComponent(Array.from(this, value => '%' + value.toString(16).padStart(2, '0')).join(''));
  }
}
function hgMD5(input) {
  const source = HGBytes.from(input); const data = HGBytes.alloc(Math.ceil((source.length + 9) / 64) * 64); data.set(source); data[source.length] = 128; data.writeBigUInt64LE(BigInt(source.length) * 8n, data.length - 8);
  const shifts = [7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21]; const constants = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0); const state = [0x67452301,0xefcdab89,0x98badcfe,0x10325476];
  for (let at = 0; at < data.length; at += 64) { let [a,b,c,d] = state; for (let i = 0; i < 64; i++) { const round = i >>> 4; const f = round === 0 ? (b & c) | (~b & d) : round === 1 ? (d & b) | (~d & c) : round === 2 ? b ^ c ^ d : c ^ (b | ~d); const g = round === 0 ? i : round === 1 ? (5 * i + 1) % 16 : round === 2 ? (3 * i + 5) % 16 : (7 * i) % 16; const n = (a + f + constants[i] + data.readUInt32LE(at + g * 4)) >>> 0; const shift = shifts[round * 4 + i % 4]; const next = (b + ((n << shift) | (n >>> (32 - shift)))) >>> 0; a = d; d = c; c = b; b = next; } for (let i = 0; i < 4; i++) state[i] = (state[i] + [a,b,c,d][i]) >>> 0; }
  const out = HGBytes.alloc(16); state.forEach((value, i) => out.writeUInt32LE(value, i * 4)); return out;
}
const HG_SHA512_CONSTANTS = ('428a2f98d728ae22 7137449123ef65cd b5c0fbcfec4d3b2f e9b5dba58189dbbc 3956c25bf348b538 59f111f1b605d019 923f82a4af194f9b ab1c5ed5da6d8118 d807aa98a3030242 12835b0145706fbe 243185be4ee4b28c 550c7dc3d5ffb4e2 72be5d74f27b896f 80deb1fe3b1696b1 9bdc06a725c71235 c19bf174cf692694 e49b69c19ef14ad2 efbe4786384f25e3 0fc19dc68b8cd5b5 240ca1cc77ac9c65 2de92c6f592b0275 4a7484aa6ea6e483 5cb0a9dcbd41fbd4 76f988da831153b5 983e5152ee66dfab a831c66d2db43210 b00327c898fb213f bf597fc7beef0ee4 c6e00bf33da88fc2 d5a79147930aa725 06ca6351e003826f 142929670a0e6e70 27b70a8546d22ffc 2e1b21385c26c926 4d2c6dfc5ac42aed 53380d139d95b3df 650a73548baf63de 766a0abb3c77b2a8 81c2c92e47edaee6 92722c851482353b a2bfe8a14cf10364 a81a664bbc423001 c24b8b70d0f89791 c76c51a30654be30 d192e819d6ef5218 d69906245565a910 f40e35855771202a 106aa07032bbd1b8 19a4c116b8d2d0c8 1e376c085141ab53 2748774cdf8eeb99 34b0bcb5e19b48a8 391c0cb3c5c95a63 4ed8aa4ae3418acb 5b9cca4f7763e373 682e6ff3d6b2b8a3 748f82ee5defb2fc 78a5636f43172f60 84c87814a1f0ab72 8cc702081a6439ec 90befffa23631e28 a4506cebde82bde9 bef9a3f7b2c67915 c67178f2e372532b ca273eceea26619c d186b8c721c0c207 eada7dd6cde0eb1e f57d4f7fee6ed178 06f067aa72176fba 0a637dc5a2c898a6 113f9804bef90dae 1b710b35131c471b 28db77f523047d84 32caab7b40c72493 3c9ebe0a15c9bebc 431d67c49c100d4c 4cc5d4becb3e42b6 597f299cfc657e2a 5fcb6fab3ad6faec 6c44198c4a475817').split(' ').map(value => BigInt('0x' + value));
function hgSHA512(input) {
  const source = HGBytes.from(input); const data = HGBytes.alloc(Math.ceil((source.length + 17) / 128) * 128); data.set(source); data[source.length] = 128; data.writeBigUInt64BE(BigInt(source.length) * 8n, data.length - 8);
  const mask = 0xffffffffffffffffn; const rotate = (v,n) => (v >> n | v << (64n-n)) & mask; const state = ['6a09e667f3bcc908','bb67ae8584caa73b','3c6ef372fe94f82b','a54ff53a5f1d36f1','510e527fade682d1','9b05688c2b3e6c1f','1f83d9abfb41bd6b','5be0cd19137e2179'].map(value => BigInt('0x' + value));
  for (let at = 0; at < data.length; at += 128) { const words = []; for (let i = 0; i < 80; i++) { if (i < 16) words.push(data.readBigUInt64BE(at + 8 * i)); else { const a = words[i - 15]; const b = words[i - 2]; words.push((words[i - 16] + (rotate(a,1n)^rotate(a,8n)^a>>7n) + words[i - 7] + (rotate(b,19n)^rotate(b,61n)^b>>6n)) & mask); } } let [a,b,c,d,e,f,g,h] = state; for (let i = 0; i < 80; i++) { const t1 = (h + (rotate(e,14n)^rotate(e,18n)^rotate(e,41n)) + ((e&f)^(~e&g)) + HG_SHA512_CONSTANTS[i] + words[i]) & mask; const t2 = ((rotate(a,28n)^rotate(a,34n)^rotate(a,39n)) + ((a&b)^(a&c)^(b&c))) & mask; h=g; g=f; f=e; e=(d+t1)&mask; d=c; c=b; b=a; a=(t1+t2)&mask; } const next = [a,b,c,d,e,f,g,h]; for (let i = 0; i < 8; i++) state[i] = (state[i] + next[i]) & mask; }
  const out = HGBytes.alloc(64); state.forEach((value, i) => out.writeBigUInt64BE(value, 8*i)); return out;
}
// AES-128 CBC decrypts only the small encrypted URL metadata, never media bytes.
function hgAES128CBC(ciphertext, key, iv) {
  if (key.length !== 16 || iv.length !== 16 || ciphertext.length % 16) throw new Error('无效的 AES 参数');
  const multiply = (a,b) => { let out=0; for(let i=0;i<8;i++){if(b&1)out^=a;a=(a<<1)^((a&128)?0x11b:0);b>>>=1;} return out&255; };
  const box = []; const inverse = [];
  for(let i=0;i<256;i++){let x=0;if(i){x=1;for(let j=0;j<254;j++)x=multiply(x,i);} const rotate=(v,n)=>((v<<n)|(v>>(8-n)))&255; const s=x^rotate(x,1)^rotate(x,2)^rotate(x,3)^rotate(x,4)^0x63;box[i]=s;inverse[s]=i;}
  const expanded = HGBytes.alloc(176); expanded.set(key); let rcon=1;
  for(let at=16;at<176;at+=4){let word=Array.from(expanded.subarray(at-4,at)); if(at%16===0){word=[box[word[1]]^rcon,box[word[2]],box[word[3]],box[word[0]]];rcon=multiply(rcon,2);}for(let j=0;j<4;j++)expanded[at+j]=expanded[at-16+j]^word[j];}
  const out = HGBytes.alloc(ciphertext.length); let previous=iv;
  for(let at=0;at<ciphertext.length;at+=16){let state=Array.from(ciphertext.subarray(at,at+16)); const add=round=>{for(let i=0;i<16;i++)state[i]^=expanded[round*16+i];}; const shift=()=>{const old=state.slice();for(let row=0;row<4;row++)for(let col=0;col<4;col++)state[row+4*col]=old[row+4*((col-row+4)%4)];}; add(10); for(let round=9;round>=0;round--){shift();state=state.map(value=>inverse[value]);add(round);if(round){for(let col=0;col<4;col++){const i=col*4;const [a,b,c,d]=state.slice(i,i+4);state[i]=multiply(a,14)^multiply(b,11)^multiply(c,13)^multiply(d,9);state[i+1]=multiply(a,9)^multiply(b,14)^multiply(c,11)^multiply(d,13);state[i+2]=multiply(a,13)^multiply(b,9)^multiply(c,14)^multiply(d,11);state[i+3]=multiply(a,11)^multiply(b,13)^multiply(c,9)^multiply(d,14);}}}for(let i=0;i<16;i++)out[at+i]=state[i]^previous[i];previous=ciphertext.subarray(at,at+16);}
  return out;
}
const HGCrypto = {
  // These are synthetic protocol IDs, not security keys or persisted identities.
  randomBytes(length) { return HGBytes.from(Array.from({length}, () => Math.floor(Math.random() * 256))); },
  createHash(kind) { let value = HGBytes.alloc(0); return { update(input) { value = HGBytes.concat([value, HGBytes.from(input)]); return this; }, digest(encoding) { const output = kind === 'md5' ? hgMD5(value) : kind === 'sha512' ? hgSHA512(value) : null; if (!output) throw new Error('不支持的散列'); return encoding ? output.toString(encoding) : output; } }; }
};

// SM3 (GB/T 32905), pure JavaScript: Electron's bundled crypto may omit SM3.
function sm3(input) {
  const source = HGBytes.isBuffer(input) ? input : HGBytes.from(input);
  const data = HGBytes.alloc(Math.ceil((source.length + 9) / 64) * 64);
  source.copy(data);
  data[source.length] = 0x80;
  data.writeBigUInt64BE(BigInt(source.length) * 8n, data.length - 8);
  const state = new Uint32Array([0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e]);
  const words = new Uint32Array(68);
  const rotate = (x, n) => ((x << (n & 31)) | (x >>> ((32 - n) & 31))) >>> 0;
  for (let offset = 0; offset < data.length; offset += 64) {
    for (let i = 0; i < 16; i++) words[i] = data.readUInt32BE(offset + i * 4);
    for (let i = 16; i < 68; i++) {
      const x = words[i - 16] ^ words[i - 9] ^ rotate(words[i - 3], 15);
      words[i] = x ^ rotate(x, 15) ^ rotate(x, 23) ^ rotate(words[i - 13], 7) ^ words[i - 6];
    }
    let [a, b, c, d, e, f, g, h] = state;
    for (let i = 0; i < 64; i++) {
      const a12 = rotate(a, 12);
      const s1 = rotate((a12 + e + rotate(i < 16 ? 0x79cc4519 : 0x7a879d8a, i)) >>> 0, 7);
      const s2 = s1 ^ a12;
      const ff = i < 16 ? a ^ b ^ c : (a & b) | (a & c) | (b & c);
      const gg = i < 16 ? e ^ f ^ g : (e & f) | (~e & g);
      const t1 = (ff + d + s2 + (words[i] ^ words[i + 4])) >>> 0;
      const t2 = (gg + h + s1 + words[i]) >>> 0;
      d = c; c = rotate(b, 9); b = a; a = t1;
      h = g; g = rotate(f, 19); f = e;
      e = (t2 ^ rotate(t2, 9) ^ rotate(t2, 17)) >>> 0;
    }
    const next = [a, b, c, d, e, f, g, h];
    for (let i = 0; i < 8; i++) state[i] ^= next[i];
  }
  const digest = HGBytes.alloc(32);
  for (let i = 0; i < 8; i++) digest.writeUInt32BE(state[i], i * 4);
  return digest;
};

const DOWNLOAD_QUALITIES = ['auto', '1080p', '720p'];

function normalizeDownloadQuality(value = 'auto') {
  if (!DOWNLOAD_QUALITIES.includes(value)) throw new Error('下载清晰度无效，请选择自动、1080p 或 720p');
  return value;
}

function meetsDownloadQuality({ width, height } = {}, quality = 'auto') {
  quality = normalizeDownloadQuality(quality);
  if (quality === 'auto') return true;
  const dimensions = [Number(width), Number(height)];
  return dimensions.every(value => Number.isFinite(value) && value > 0)
    && Math.min(...dimensions) >= Number.parseInt(quality, 10);
}


const localId = () => String(1000000000000000n + BigInt('0x' + HGCrypto.randomBytes(6).toString('hex')));
const PROCESS_NONCE = HGCrypto.randomBytes(18).toString('base64url');
const PROCESS_STARTED = Date.now();
const VIDEO_API = 'https://api5-normal-sinfonlineb.fqnovel.com/novel/player/multi_video_model/v1/';
const VIDEO_UA = 'com.phoenix.read/71332 (Linux; U; Android 16; zh_CN; 25053RT47C; Build/BP2A.250605.031.A3; Cronet/TTNetVersion:04657795 2026-01-23 QuicVersion:c67e9834 2025-09-08)';
const DEVICE = {
    ac: 'wifi', channel: 'update_64', aid: '8662', app_name: 'novelread',
    version_code: '71332', version_name: '7.1.3.32', device_platform: 'android', os: 'android',
    ssmix: 'a', device_type: '25053RT47C', device_brand: 'Redmi', language: 'zh', os_api: '36',
    os_version: '16', manifest_version_code: '71332', resolution: '1280*2772', dpi: '520',
    update_version_code: '71332', host_abi: 'arm64-v8a', dragon_device_type: 'phone', pv_player: '71332',
    compliance_status: '0', need_personal_recommend: '1', player_so_load: '1', is_android_pad_screen: '0',
};
function str(value, fallback = '') { return String(value == null ? fallback : value).trim(); }
function cleanUrl(value) { return str(value).replace(/\\\//g, '/').replace(/\\u0026/g, '&').replace(/&amp;/g, '&'); }
function jsonBody(value) { try { return JSON.parse(value); } catch { return null; } }
// 签名对 query 字节级敏感：python urllib.parse.quote 的 ['!'*'()'] 兜底编码行为须保持一致
function pythonUrlEncode(values) {
    return Object.entries(values).map(([key, value]) => {
        const encode = (item) => encodeURIComponent(String(item == null ? '' : item))
            .replace(/[!'()]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
        return `${encode(key)}=${encode(value)}`;
    }).join('&');
}
function md5(value) { return HGCrypto.createHash('md5').update(value).digest('hex').toUpperCase(); }

function u32(value) { return Number(value) >>> 0; }
function rol32(value, count) { const n = count & 31; const x = u32(value); return u32((x << n) | (x >>> (32 - n))); }
function ror32(value, count) { const n = count & 31; const x = u32(value); return u32((x >>> n) | (x << (32 - n))); }
function ror64(value, count) { const n = BigInt(count) & 63n; const x = BigInt.asUintN(64, BigInt(value)); return BigInt.asUintN(64, (x >> n) | (x << (64n - n))); }
function le32(value) { const b = HGBytes.alloc(4); b.writeUInt32LE(u32(value)); return b; }
function be32(value) { const b = HGBytes.alloc(4); b.writeUInt32BE(u32(value)); return b; }
function zigzag(value) { const n = BigInt(value); return n < 0n ? ((-n) * 2n - 1n) : n * 2n; }
function varint(value) { let n = BigInt(value); const out = []; while (n > 127n) { out.push(Number((n & 127n) | 128n)); n >>= 7n; } out.push(Number(n)); return HGBytes.from(out); }
function protoField(tag, value, type = 'string') {
    if (value === undefined || value === null || value === '') return HGBytes.alloc(0);
    if (type === 'bytes' || type === 'string' || type === 'message') {
        const body = type === 'bytes' ? HGBytes.from(value) : type === 'message' ? value : HGBytes.from(String(value));
        return HGBytes.concat([varint((BigInt(tag) << 3n) | 2n), varint(body.length), body]);
    }
    if (type === 'float') { const body = HGBytes.alloc(4); body.writeFloatLE(Number(value)); return HGBytes.concat([varint((BigInt(tag) << 3n) | 5n), body]); }
    return HGBytes.concat([varint(BigInt(tag) << 3n), varint(type === 'sint' ? zigzag(value) : value)]);
}
function proto(fields) { return HGBytes.concat(fields.map(([tag, value, type]) => protoField(tag, value, type))); }
function getIv(iv, data) { let value = u32(iv); for (let i = 0; i < data.length; i += 1) { if ((i & 1) === 0) value = u32((value >>> 4) ^ value ^ (value << 6) ^ data[i]); else value = u32(~((value >>> 7) ^ value ^ (data[i] | (value << 12)))); } return value; }
function sumMd5(data) { let check = 0x20220420; for (let i = 0; i < 12; i += 1) { const temp = (i & 1) === 0 ? (check >>> 3) ^ check : (check >>> 5) ^ check; check = (i & 1) === 0 ? data[i] ^ (check << 7) : data[i] | (check << 11); if ((i & 1) !== 0) check = ~check; check = u32(check ^ temp); } return u32((check | 4) ^ 0x1000000); }
const BRANCH2_SV = [0xa7aefe20,0x7149f1d6,0x47e4ca07,0xe9b58f67,0x93b924de,0xc614d0f5,0x38afe0ef,0xb2bbad73,0xe24444c3,0x9d3aec9b,0xdf7b37e4,0xd8b16d40,0xf8ac31b8,0x76b9a90b,0x31d833ee,0x953fce64,0x353595a4,0x4609c13b,0x36925008,0x8c6d0925,0x5df5c177,0x1cfbf52b,0x8a4fa7f0,0x114ca35e,0x8193f984,0x7a7a8733,0x316ab4d5,0x3c20cfc9,0xa6d84453,0x3a18500c,0x798ec47a,0x97a76b28,0x66c4ff96,0x51716443,0xdd2fc3b,0xb5696da7,0xbbeb3ac5,0x5c53d204,0xd32608ce,0x7279b9ec,0xf4188ecf,0xf7d793db,0x332cc491,0xab76ae15,0x9bebe727,0x18a01384,0x5be9f8a7,0x5f90a754,0x39b663c0,0x36673c83,0x7c92f514,0x9d7d94d7,0xe2e8d9aa,0x5f7e9ea9,0x7abd4551,0x569e05da,0x40a25632,0x3df5a9a5,0xbab37d80,0x454286dc,0x3f5d4e78,0x3d7b75d,0xb1fe4af7,0xa5ab26a3];
const BRANCH2_ORDERS = HGBytes.from('0f0704000908030a060b050d0e010c020f05080c0009020103070e060b0a0d04060500070c000a04080f010b0d09020e060b02050403080101070a000d0c090e0d070e0f0b0208030c0509010004060a0d0902060f0b0a040807000c0503010e0c090f07060f030e020d0405010b0a000c050a090e0802040407030f01060b000b0f0408020a0700090d06010e03050c0b060a0508020c03070f0e090d0001040906080f050800040a0b030d01020c0e090d0c0604070a03030f00080105020e01000d0f090a0b0e0402080703060c0501080a0c0f0905060b000304020e070d04080f000c0f0e0d0a01060207090503040205080d0b0a0606000e0f070c09030a08040f000b01060d0c0709030e05020a070b050f00020e0108030d0c0609040d070f08050f06040b0a0e0c090002030d0c020704010b0e0e08060f09050003','hex');
function md5V3Step(kind, a, b, c, d, m, shift, constant) { let f; if (kind === 0) f = (b & c) | ((~b) & d); else if (kind === 1) f = (b & d) | (c & (~d)); else if (kind === 2) f = b ^ c ^ d; else f = c ^ (b | (~d)); return u32(b + rol32(u32(a + f + m + constant), shift)); }
function md5SumV3(message, countV2, orders, countV1) {
    const sv = BRANCH2_SV.map((value) => ror32(value, countV1)); const start = [ror32(0x79e0f2fb, countV2), ror32(0xc8b52570, countV2), ror32(0xebc2f8cd, countV2), ror32(0x7c104d93, countV2)]; const endCount = (countV2 + 6) & 255; const end = [ror32(0x19be4866, endCount), ror32(0xe85986b4, endCount), ror32(0xe19b326e, endCount), ror32(0x71d1d7d4, endCount)]; const m = []; for (let i = 0; i < 16; i += 1) m.push(message.readUInt32LE(i * 4)); let [a,b,c,d] = start;
    const run = (kind, order, shifts, offset) => { for (let i = 0; i < 16; i += 1) { const phase = i & 3; const next = phase === 0 ? md5V3Step(kind,a,b,c,d,m[orders[offset + i]],shifts[i],sv[offset + i]) : phase === 1 ? md5V3Step(kind,d,a,b,c,m[orders[offset + i]],shifts[i],sv[offset + i]) : phase === 2 ? md5V3Step(kind,c,d,a,b,m[orders[offset + i]],shifts[i],sv[offset + i]) : md5V3Step(kind,b,c,d,a,m[orders[offset + i]],shifts[i],sv[offset + i]); if (phase === 0) a = next; else if (phase === 1) d = next; else if (phase === 2) c = next; else b = next; } };
    run(0, orders, [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22], 0);
    run(1, orders, [5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20], 16);
    run(2, orders, [4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23], 32);
    run(3, orders, [6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21], 48);
    const ret = HGBytes.alloc(16); ret.writeUInt32LE(u32((start[0] + a) ^ end[0]), 0); ret.writeUInt32LE(u32((start[1] + b) ^ end[1]), 4); ret.writeUInt32LE(u32((start[2] + c) ^ end[2]), 8); ret.writeUInt32LE(u32((start[3] + d) ^ end[3]), 12); return HGBytes.concat([ret, le32(sumMd5(ret))]);
}
function branch2F13(iv, querySm3, bodyMd5, tsBytes, khronos) { const v = (iv & 13) * 86; const ivV0 = ((v >>> 15) & 255) + ((v >>> 8) & 255); const n1 = [0x8980f29b,0xeb549c7f,0xb08726db,0xd40cb5e6,0xe8f559e4][ivV0]; const countV1 = (n1 + khronos + 1) & 255; const countV2 = u32(n1 + khronos); const shift = (countV2 + 5) & 7; const seed = [0x84,0x96,0x77,0x9d,0xd4,0x15,0x0b,0xf8]; const pad = HGBytes.from(seed.map((value) => ((value | (value << 8)) >> shift) & 255)); const input = HGBytes.concat([querySm3,bodyMd5,tsBytes,pad,HGBytes.from('a0010000','hex')]); return md5SumV3(input,countV2,BRANCH2_ORDERS.subarray(ivV0 << 6,(ivV0 + 1) << 6),countV1); }
function bxor(a, b) { const out = HGBytes.alloc(Math.min(a.length, b.length)); for (let i = 0; i < out.length; i += 1) out[i] = a[i] ^ b[i]; return out; }
function hashF13(querySm3, bodyMd5, tsBytes, khronos) {
    const iv = getIv(getIv(getIv(0x20230928, querySm3), bodyMd5), tsBytes); const low = iv & 15; const ivV0 = (low * 171) >> 9; const branch = low - ivV0 * 3;
    if (branch === 2) return branch2F13(iv, querySm3, bodyMd5, tsBytes, khronos);
    if (branch !== 0) return HGBytes.concat([querySm3.subarray(0, 16), bodyMd5, le32(sumMd5(HGBytes.concat([querySm3, bodyMd5]))) ]);
    const ivV1List = [0xc4a78580, 0xb3c0fd39, 0xc58c5686, 0xc9aa3ba7, 0xf5a7adf2, 0x963c2ed1]; const ivV1 = ivV1List[ivV0]; const countV1 = (ivV1 + khronos + 1) & 255; const countV2 = u32(ivV1 + khronos);
    const tt02 = [0xebb64faf,0x7aadcc2,0xcf3187bf,0xe01138ff,0x6d0bfcff,0x5a30a3be,0xb41ad638,0x34180eb8,0xf233eb6f,0xb1a584cc,0xccc30dc7,0x47d1db51,0xd55653de,0x70a84fa1,0x57473c12,0xf76f0288,0x2c077f0a,0xda0dcad0,0xfbb86f6c,0xfdc4cf00,0x688a020d,0xe676c6a6,0x8cd6338b,0x1a3c8d0e,0xcce8b06b,0x6ad0ed0b,0xa0522717,0xdc71ac83,0x2285db71,0xd5b4dda6,0x736f8650,0x6560306c,0x617ce2a6,0xe423417e,0xa40e143,0x544e4032,0x88dffb2a,0x716c1ae0,0x4c467a88,0x5b23bb3,0xe1d0b866,0xbaa3dcb8,0xae3374d3,0xc3381a50,0x1702f75b,0xfe6da368,0xf0b4cf48,0x4e0ffbb8,0x72aad10d,0x26c53a3d,0xf2bce0f6,0xb4557581,0x4a257fdd,0x8c3182a2,0xab0b3b86,0x3d5dfb14,0x4f103634,0xd37b52d7,0x444eff16,0xeb0a33d1,0x6ca86f6e,0x284ba7,0x8387cfa,0x5fb37586];
    const tt = tt02.map((value) => ror32(value, countV1)); const n0 = (countV2 + 2) & 7; const seed = [0xfa,0x45,0x61,0xd7]; const pad = HGBytes.from(seed.map((value) => ((value | (value << 8)) >> n0) & 255));
    const data = HGBytes.concat([querySm3, bodyMd5, tsBytes, pad, HGBytes.from('00000000000001a0','hex')]); const di = []; for (let i = 0; i < data.length; i += 4) di.push(data.readUInt32BE(i)); let di0 = di[0]; for (let i = 0; i < 112; i += 1) { const di1 = di[i + 1]; const di14 = di[i + 14]; const r1 = rol32(di1, 14) ^ rol32(di1, 25) ^ (di1 >>> 3); const r2 = rol32(di14, 13) ^ rol32(di14, 15) ^ (di14 >>> 10); di.push(u32(di0 + di[i + 9] + r1 + r2)); di0 = di1; }
    const init = [0x7aba4fc8,0x67166507,0x6403fa00,0x340f512f,984304912,3005047866,2874125293,2152413264].map((v) => ror32(v, countV2 & 31)); const chosen = [[101,5,7,6,3,2,1,0,5,4,3],[96,0,6,7,5,3,2,1,5,4,4],[96,7,6,2,1,4,0,5,4,3,5],[99,3,6,2,4,5,1,0,0,7,6],[96,0,5,6,7,3,1,2,5,4,4],[100,2,0,3,5,4,6,7,2,1,5]][ivV0]; let d = init.slice(); for (let i = 0; i < chosen[0]; i += 1) { const base = ivV1 + i; const n0v = di[base & 127]; const n1 = ((d[chosen[3]] ^ d[chosen[4]]) & d[chosen[1]]) ^ d[chosen[3]]; const n2 = rol32(d[chosen[1]],26)^rol32(d[chosen[1]],21)^rol32(d[chosen[1]],7); const n4 = u32(n0v+n1+n2+tt[base&63]+d[chosen[5]]); const n5=rol32(d[chosen[2]],30)^rol32(d[chosen[2]],19)^rol32(d[chosen[2]],10); const n6=(d[chosen[2]]&d[chosen[6]])|((d[chosen[2]]|d[chosen[6]])&d[chosen[7]]); const n7=u32(n5+n6); const old=d[chosen[9]]; d.unshift(d.pop()); d[chosen[10]]=u32(n7+n4); d[chosen[8]]=u32(old+n4); }
    const ret = HGBytes.alloc(32); for (let i = 0; i < 8; i += 1) ret.writeUInt32BE(u32(d[i]+init[i]), i*4); const folded = bxor(ret.subarray(0,16), ret.subarray(16)); folded.copy(ret,0); return HGBytes.concat([ret.subarray(0,16), le32(sumMd5(ret.subarray(0,16)))]);
}
function reverseBits(value) { let result = 0; for (let i = 0; i < 8; i += 1) result = (result << 1) | ((value >> i) & 1); return result; }
function rc4Gorgon(data, key) {
    const s = Array.from({ length: 256 }, (_v, i) => i); let j = 0;
    for (let i = 0; i < 256; i += 1) { j = (j + s[i] + key[i % key.length]) & 255; s[i] = s[j]; }
    let i = 0; j = 0;
    return HGBytes.from(data.map((value) => { i += 1; const x = s[i]; j += x; const y = s[j & 255]; s[i] = y; return value ^ s[(y + y) & 255]; }));
}
function xGorgon(query, body, timestamp, random) {
    const sdk = HGBytes.alloc(4); sdk.writeUInt32LE(67503104);
    const input = HGBytes.concat([HGCrypto.createHash('md5').update(query).digest().subarray(0, 4), body ? HGCrypto.createHash('md5').update(body).digest().subarray(0, 4) : HGBytes.alloc(4), HGBytes.alloc(4), sdk, be32(timestamp)]);
    const key = [0x4a, 0x40, 0x16, (random >> 8) & 255, 0x47, 0x6c, 0x01, random & 255]; const out = rc4Gorgon([...input], key);
    for (let i = 0; i < out.length; i += 1) { let value = out[i]; value = ((value >> 4) | (value << 4)) & 255; const next = i + 1 < out.length ? out[i + 1] : out[0]; out[i] = (~(reverseBits((next ^ value) & 255) ^ 20)) & 255; }
    return HGBytes.concat([HGBytes.from('8404', 'hex'), HGBytes.from([random & 255, (random >> 8) & 255, 0x40, 0x01]), out]).toString('hex');
}
function deviceProto(deviceId) { return proto([[1,1,'sint'],[2,2,'sint'],[3,'8662'],[4,deviceId],[5,PROCESS_NONCE],[6,'!noperm!'],[7,-888888,'sint'],[8,-888888,'sint'],[9,3,'sint'],[10,-888888,'sint'],[11,'!notset!'],[12,'Asia/Shanghai,8'],[13,'zh_CN'],[14,4,'sint'],[16,0,'float'],[17,0,'float'],[18,0,'float'],[19,0,'float'],[20,0,'float'],[21,0,'float'],[22,'16'],[23,41,'sint'],[24,36,'sint'],[25,PROCESS_STARTED,'sint'],[26,PROCESS_STARTED,'sint'],[27,PROCESS_STARTED,'sint'],[28,PROCESS_STARTED,'sint'],[29,-1,'sint'],[30,'25053RT47C'],[31,'Redmi'],[32,'25053RT47C'],[33,'25053RT47C'],[34,'Xiaomi'],[35,'Redmi'],[36,'Redmi'],[38,31,'sint']]); }
const SBOX = HGBytes.from('+n0Ia5xZs0sEXznQOEqRmQBnpiCf9U2Ccybu3xhmgzOAAxn72f6uqqmwUsYL83klTni0NqxdGieeiNu9PGPsSRXBMB/cuFbUbM3KCUPINaPvHvSW0vwOcnuUhNHqRVpiAj/TEoE0K91+5ijypUYTATsh9mE3KSoN7Yyvv51cuyR2D3XkU4nhmI2xmmVwT1RMWKtub4sjxAcRDLrPoKSO2AU9FLLadMPX577Wf95IFj6FkKFVt3dCIsmGUC4X+WQxLJvxbRxEaOPpqJOXyzJX6+Vxaq3AzMfF/WAdoi1Hp+JRaV56zgpBtpWP97mH4DoGEIq1+FvV8LyS/3wvwugbQOwb2r26mJEMsiuDQTRn+wrYdrVGBVlhI3WQhyrjUBVMrLF5667llUcEaPCGPVGLD8qO5LlO8hKCvA7V9+8oJc9bXelqVQLhM76T5/WtnT45JKji+hdX0HoNCDDWuKON/QeaxB5uImSX0h2wv0VmP2zd2yeApxHcpsVS+MC2yFwAc2B7oBkTqsk1SEvTpM2fmfMQREBUfin0Bh+iq6EvPPavhWI2IX9e3yAas7Tm/3KEj2UmlFp36kN4x0rMLBRrxuh0U/zUHM4xcAMYjJY4MonxOl/X+alpt2M3WMI7w3HLnpIBigtNiJu7T21v4P6lSd5WFgntnMEt7oF92XzRLkJbTcGmXepE/UVOG6E/0YnhfS+q26utWcuxzpooyeD2cDlK1/8w9d28VzsRjbLuALbmGlp8+d7EzS6Au7lMpZ+ECMZvQmzwJ+eLOpxR+2chdUExp8ogQyq3v9l68rX4jCwjg0+PYKAEEzcU4wHFY2ZcdIHfWL1okD3SszT0GZMyKdZJrg1L2AeerB4tC0C4crp2EHGo5FYdSP7lwkeR2ocmnR+Ia8CYviUJlzOjhRZef9xuVOn3qcjow3fQgivsAmKKkg4+sA8F8/GWeDiGNhg8JM8KtFPMYWWkx5TVFX5t73kiNRJqjlIGVXtGZFCV4gzt0xcDopuZ6xz8r9Rzafpf9ywev8jh8592gHFIqpStZPuJxmDDMrNN0uBE3V+oscdoIzTJbRJ/t+sVvqnReJOgDJKk10fjisJwqyZBmnmn2BSFj8BvVtCMEbkuPOKdzw7eA11GPs04Qw8zWtkaZWwiO/wwpojqN6K0jY5RnNZA7vn4hPSul+nKCkVnVwQvg1zVxcSCtqORmB9KrJaBbssbCQivGJVJfVTt+hYxOtq4ZvWl8f4QAQZ0zGPffCgl9s6yT4vlvIdpu4YhBwA25wtQWZsc6GJYGWHyvSdeuh3mmUI9DSq13Fsp8C1MU3tqc04/df9LoTUXVXI5INOw/e8C7Hd+5CvbkMEFnnrUUmskEw==','base64');
function xorBytes(a, b) { const out = HGBytes.from(a); for (let i = 0; i < out.length; i += 1) out[i] ^= b[i % b.length]; return out; }
function matrix(bytes) { return Array.from({ length: 4 }, (_v, i) => Array.from(bytes.subarray(i * 4, i * 4 + 4))); }
function flat(rows) { return HGBytes.from(rows.flat()); }
function aesMix(rows) { for (let i = 0; i < 4; i += 1) { const t=rows[0][i]^rows[1][i]^rows[2][i]^rows[3][i]; const u=rows[0][i]; const xt=(x)=>((x<<1)^((x&128)?0x1b:0))&255; rows[0][i]^=t^xt(rows[0][i]^rows[1][i]); rows[1][i]^=t^xt(rows[1][i]^rows[2][i]); rows[2][i]^=t^xt(rows[2][i]^rows[3][i]); rows[3][i]^=t^xt(rows[3][i]^u); } }
class AesV3 {
    constructor(key, khronos) { this.wordSize=khronos&3; this.box=SBOX.subarray(this.wordSize*256,(this.wordSize+1)*256); this.con=[[1,0,2,3],[1,3,0,2],[0,1,3,2],[1,0,2,3]][this.wordSize]; this.con2=[[1,0,2,3],[2,0,3,1],[0,1,3,2],[1,0,2,3]][this.wordSize]; this.order=[[0,9,14,11,4,13,2,7,8,1,6,15,12,5,10,3],[0,9,14,15,4,13,2,7,8,1,6,3,12,5,10,11],[0,9,14,7,4,13,2,11,8,1,6,3,12,5,10,15],[0,9,14,11,4,13,2,7,8,1,6,15,12,5,10,3]][this.wordSize]; const init=[0xca025ddc,0x823dc546,0xc9420583,0xc298225f][this.wordSize]; const initial=HGBytes.alloc(16); for(let i=0;i<4;i+=1)initial.writeUInt32LE(init,i*4); const mk=xorBytes(initial,key); const expanded=HGBytes.concat([mk,HGBytes.alloc(32)]); let rounds=8; for(let i=4;i<12;i+=1){let at=4*(i-1);let a=expanded[at],b=expanded[at+1],c=expanded[at+2],d=expanded[at+3];if((i&3)===0){const t=(u32(init>>((rounds&24)))^this.box[b])&255;b=this.box[c];c=this.box[d];d=this.box[a];a=t;}rounds+=2;expanded[at+4]=a^expanded[at-12];expanded[at+5]=b^expanded[at-11];expanded[at+6]=c^expanded[at-10];expanded[at+7]=d^expanded[at-9];} this.keys=Array.from({length:12},(_v,i)=>Array.from(expanded.subarray(i*4,i*4+4))); }
    add(rows,key) { for(let i=0;i<4;i+=1) for(let j=0;j<4;j+=1) rows[i][j]^=key[i][j]; }
    addCon(rows, keys) { for(let i=0;i<4;i+=1) for(let j=0;j<4;j+=1) rows[i][j]^=keys[i][this.con2[j]]; }
    sub(rows) { for(let i=0;i<4;i+=1) for(let j=0;j<4;j+=1) rows[i][j]=this.box[rows[i][j]]; const old=rows.map((x)=>x.slice()); for(let i=0;i<4;i+=1) rows[i]=old[this.con2[i]]; }
    shift(rows) { const b=flat(rows); for(let i=0;i<16;i+=1) rows[Math.floor(i/4)][i%4]=b[this.order[i]]; }
    shiftCon(rows) { const old=rows.map((x)=>x.slice()); for(let i=0;i<4;i+=1) rows[i]=this.con2.map((x)=>old[i][x]); }
    block(value) { const rows=matrix(value); this.addCon(rows,this.keys.slice(0,4)); for(let i=1;i<3;i+=1){this.sub(rows);this.shift(rows);if(i===1){this.shiftCon(rows);aesMix(rows);}this.addCon(rows,this.keys.slice(i*4));}this.add(rows,this.keys.slice(4));return flat(rows); }
    encrypt(data, iv) { const source=HGBytes.from(data); const plaintext=HGBytes.alloc(32); for(let i=0;i<31;i+=1){const at=i*8;const n0=(source[at]>>4)&2;const n1=n0|(source[at+1]&64);const n2=n1|((source[at+2]>>2)&1);const n3=n2|((source[at+3]<<3)&128);const n4=n3|((source[at+4]>>1)&4);const n5=n4|((source[at+5]<<3)&16);const n6=n5|((source[at+6]<<5)&32);plaintext[i]=n6|((source[at+7]>>4)&8);} plaintext[31]=1; const blocks=[]; let previous=HGBytes.from(iv); for(let i=0;i<plaintext.length;i+=16){const value=this.block(xorBytes(plaintext.subarray(i,i+16),previous));blocks.push(value);previous=value;} const key=HGBytes.concat(blocks); const out=HGBytes.from(source); for(let i=0;i<31;i+=1){const at=i*8; const k=key[i]; out[at]&=0xdf;out[at]|=(k<<4)&32;out[at+1]&=0xbf;out[at+1]|=k&64;out[at+2]&=0xfb;out[at+2]|=(k<<2)&4;out[at+3]&=0xef;out[at+3]|=(k>>3)&16;out[at+4]&=0xf7;out[at+4]|=(k+k)&8;out[at+5]&=0xfd;out[at+5]|=(k>>3)&2;out[at+6]&=0xfe;out[at+6]|=(k>>5)&1;out[at+7]&=0x7f;out[at+7]|=(k<<4)&128;} return HGBytes.concat([key.subarray(-1),out]); }
}
function xmxor(data, key) { const encoded=HGBytes.alloc(data.length); for(let i=0;i<data.length;i+=1){const at=(i*4)&28;const d0=key[at],d1=key[at+1];let d2=((((data[i]<<4)|(data[i]>>>4))&255)+d0);d2=(~d2)^d1;d2=((((d2&255)<<3)|((d2&255)>>>5))&255);d2=(d2+d1)&255;d2=(d2^d0)&255;encoded[data.length-i-1]=(~d2)&255;} let last=encoded[encoded.length-1]^encoded[encoded.length-2];const first=encoded[0];encoded[0]=(~last+first)&255;encoded[1]=((encoded[0]^encoded[encoded.length-1]^254)+encoded[1])&255;encoded[2]=(encoded[2]+((last-first)^(((encoded[1]<<3)|(encoded[1]>>>5))&255)^2))&255;for(let i=0;i<encoded.length-4;i+=1){const temp=(((encoded[i+2]<<3)|(encoded[i+2]>>>5))&255)^encoded[i+1]^(i+3);encoded[i+3]=(~temp+encoded[i+3])&255;}encoded[encoded.length-1]^=encoded[encoded.length-2];let sum=0;for(let i=0;i<encoded.length-1;i+=1)sum+=encoded[i+1];encoded[0]=((encoded[0]^encoded[1])+sum)&255;return encoded; }
function keyHash(signKey, random) { const input=HGBytes.concat([signKey,le32(random),signKey]); const hash=sm3(input); const d1=(random>>16)&255; let d2=((d1<<11)|(random>>>24))^(d1>>5)^d1; d2=(~d2)>>>0; return [hash,le32(d2)]; }
function buildMedusa(url, body, khronos, device) {
    const bodyMd5=body?HGCrypto.createHash('md5').update(body).digest():HGBytes.alloc(16); const querySm3=sm3(url.split('?')[1]); const ts=le32(khronos); const queryBodyTs=hashF13(querySm3,bodyMd5,ts,khronos); const nested=proto([[1,111,'sint'],[2,10,'sint'],[3,694367,'sint'],[5,586952199,'sint']]); const messageRand=Math.floor(Math.random()*0x100000000); const envLaunch=Math.floor(Math.random()*21)+100; const envPid=Math.floor(Math.random()*2000)+10001; const env=proto([[1,envLaunch,'sint'],[2,146331399,'sint'],[3,146331396,'sint'],[5,7,'sint'],[6,'v04.06.04.03-bugfix'],[7,envPid,'sint'],[12,deviceProto(device.device_id),'message'],[13,proto([[1,Math.floor(Date.now()/1000),'sint'],[2,-2,'sint'],[4,200,'sint']]),'message'],[14,device.version_name]]); const queryHash=sm3(HGBytes.concat([HGBytes.from(url.split('?')[1]),bodyMd5,HGBytes.from('none')])); const message=proto([[1,HGBytes.from('f7e85ffad7d7dc3bd62ac87057cf6118','hex'),'bytes'],[2,3,'sint'],[3,messageRand,'sint'],[4,'8662'],[5,device.device_id],[6,'1588093228'],[7,device.version_name],[8,'v04.06.04-ml-android'],[9,67503104,'sint'],[10,HGBytes.from('4001000000000000','hex'),'bytes'],[12,khronos,'sint'],[13,queryBodyTs,'bytes'],[14,querySm3.subarray(0,6),'bytes'],[15,nested,'message'],[16,PROCESS_NONCE],[17,khronos,'sint'],[19,queryHash,'bytes'],[20,'none'],[21,312,'sint'],[23,env,'message'],[24,'{\"cmr\":16777216,\"cmr2\":16777216,\"un_h\":1879194040,\"vpn\":0,\"kd\":0,\"fkd\":3672518972,\"pd\":-1872573247,\"dyn\":\"\",\"do\":0,\"tk\":true}']]); const random=Math.floor(Math.random()*0x100000000); const [hash,seed]=keyHash(HGBytes.from('8ebdfa3806ecc5cee79423e6029ed82540bc2218bb7eae f71cb691f7aa8aa2f5'.replace(/ /g,''),'hex'),random); let transformed=xmxor(message,hash); transformed=HGBytes.concat([HGBytes.from('4001000000000000','hex'),transformed]).reverse(); for(let i=0;i<transformed.length;i+=1)transformed[i]^=seed[(~i)&3]; const check=((querySm3[0]&63)<<14)|0x18000001|((queryBodyTs[0]&63)<<8); const xmRand=Math.floor(Math.random()*0x100000000); const packed=HGBytes.concat([HGBytes.from([0x35]),le32(xmRand),le32(check),transformed,HGBytes.from([random>>16,random>>24])]); const encrypted=new AesV3(HGBytes.from('f1593376766ea98d34f31b057a9d5be4','hex'),khronos).encrypt(packed,HGBytes.from('1fe109a4125283f418de9e051a969e12','hex')); const version=HGBytes.from('03000000f7e85ffad7d7dc3bd62ac87057cf6118','hex'); const prefix=HGBytes.alloc(20); for(let i=0;i<20;i+=4) prefix.writeUInt32LE(u32(version.readUInt32LE(i)^khronos),i); return HGBytes.concat([prefix,HGBytes.from([random&255,(random>>8)&255,0,1]),encrypted]).toString('base64');
}
function helios(khronos) {
    const random = Math.floor(Math.random() * 0x100000000); const data = HGBytes.concat([le32(random), HGBytes.from('8662')]); const digest = HGCrypto.createHash('md5').update(data).digest(); const ascii = HGBytes.from(digest.toString('hex'), 'ascii'); const words = [];
    for (let i = 0; i < 4; i += 1) words.push(ascii.readBigUInt64LE(i * 8)); const table = [words[0]]; let b0 = words[0]; let b8 = words[1]; words.splice(0, 2);
    for (let i = 0; i < 34; i += 1) { let x8 = BigInt.asUintN(64, ror64(b8, 8) + b0); x8 = BigInt.asUintN(64, x8 ^ BigInt(i)); words.push(x8); x8 = BigInt.asUintN(64, x8 ^ ror64(b0, 61)); table.push(x8); b0 = x8; b8 = words.shift(); }
    const text = HGBytes.from(`${khronos}-1588093228-8662`); const pad = HGBytes.alloc(Math.ceil((text.length + 1) / 16) * 16, 16 - (text.length % 16)); text.copy(pad); const output = [];
    for (let at = 0; at < pad.length; at += 16) { let a = pad.readBigUInt64LE(at); let b = pad.readBigUInt64LE(at + 8); for (let i = 0; i < 34; i += 1) { b = BigInt.asUintN(64, table[i] ^ (a + ror64(b, 8))); a = BigInt.asUintN(64, b ^ ror64(a, 61)); } const block = HGBytes.alloc(16); block.writeBigUInt64LE(a); block.writeBigUInt64LE(b, 8); output.push(block); }
    return HGBytes.concat([le32(random), ...output]).toString('base64');
}

function branchOf(url, body, khronos) { const bodyMd5 = body ? HGCrypto.createHash('md5').update(body).digest() : HGBytes.alloc(16); const q = sm3(url.split('?')[1]); const iv = getIv(getIv(getIv(0x20230928, q), bodyMd5), le32(khronos)); const low = iv & 15; return low - (((low * 171) >> 9) * 3); }
function signedVideoRequest(payload) {
    // Keep the request's synthetic identity consistent across URL and signature.
    const device = { ...DEVICE, iid: localId(), device_id: localId() };
    const khronos = Math.floor(Date.now() / 1000); const body = HGBytes.from(payload); const ticketBase = Date.now(); let requestTicket = ticketBase; let query = ''; let url = '';
    // branch 1 的签名变体服务端不认：抖动 _rticket 找一个可用的 branch（最多试 32 秒偏移）
    for (let offset = 0; offset < 32; offset += 1) { requestTicket = ticketBase + offset; const values = { ...device, ts: String(khronos), _rticket: String(requestTicket) }; query = pythonUrlEncode(values); url = `${VIDEO_API}?${query}`; if (branchOf(url, body, khronos) !== 1) break; }
    const random = Math.floor(Math.random() * 65536); const headers = {
        'User-Agent': VIDEO_UA, Accept: 'application/json; charset=utf-8,application/x-protobuf', 'Content-Type': 'application/json; charset=UTF-8',
        'x-xs-from-web': '0', 'x-ss-req-ticket': String(requestTicket), 'x-tt-request-tag': 't=0;n=0', 'sdk-version': '2', 'passport-sdk-version': '50561',
        'x-vc-bdturing-sdk-version': '3.7.2.cn', 'x-ss-stub': md5(body), 'x-gorgon': xGorgon(query, body, khronos, random),
        'x-khronos': String(khronos), 'x-ladon': be32(khronos).toString('base64'), 'x-argus': le32(khronos).toString('base64'),
        'x-helios': helios(khronos), 'x-medusa': buildMedusa(url, body, khronos, device), 'x-tt-dt': '',
    };
    return { url, headers, body };
}
function parseFallback(value) {
    if (typeof value === 'string') { const parsed = jsonBody(value); return parsed?.fallback_api || value; }
    if (Array.isArray(value)) return str(value[0]);
    return str(value?.fallback_api);
}
function deriveContentKey(value) {
    const raw = HGBytes.from(str(value).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    if (raw.length < 3) throw new Error('spade_a too short');
    let v8 = raw.length - (raw[0] ^ raw[1] ^ raw[2]) + 47;
    v8 = Math.min(v8, raw.length - 1);
    if (v8 < 33) throw new Error('spade_a key length invalid');
    const work = HGBytes.from(raw.subarray(1, 1 + v8)); let a = 85; let b = 246;
    for (let i = 0; i < v8; i += 1) {
        const old = work[i]; const previous = i & 1 ? a : b;
        if (i & 1) a = old; else b = old;
        const pop = i.toString(2).split('1').length - 1;
        work[i] = (-21 - pop + (previous ^ old)) & 255;
    }
    const hex = work.subarray(1, 33).toString('ascii');
    if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error('App 视频密钥格式无效');
    return HGBytes.from(hex, 'hex');
}

function decryptSpadeUrl(value, seed) {
    const encoded = str(value); if (!encoded) return '';
    const raw = HGBytes.from(encoded, 'base64');
    if (raw.length < 5) throw new Error('spade URL ciphertext too short');
    if (raw[0] !== 0xa8 || raw[2] !== 0x01 || raw[3] !== 0x00) throw new Error('spade URL header format error');
    const cipherLength = Math.floor((raw.length - 4) / 16) * 16;
    if (!cipherLength) throw new Error('spade URL ciphertext has no complete block');
    const constants = HGBytes.from('4dd4c2e6b83162090e52b3c7a6733ba41cb2462b829ab58a196b39db57177524f49baf7f08e8d68d26a72e37c1a95a2f1f05a51892aef2949732b62a38aadd58', 'hex');
    const h1 = HGCrypto.createHash('sha512').update(seed).digest(); const h2 = HGCrypto.createHash('sha512').update(HGBytes.concat([h1, constants])).digest();
    let plaintext = hgAES128CBC(raw.subarray(4, 4 + cipherLength), h2.subarray(0, 16), h2.subarray(16, 32));
    if (plaintext.length) {
        const padding = plaintext[plaintext.length - 1];
        if (padding >= 1 && padding <= 16 && padding <= plaintext.length) plaintext = plaintext.subarray(0, plaintext.length - padding);
    }
    while (plaintext.length && plaintext[plaintext.length - 1] === 0) plaintext = plaintext.subarray(0, plaintext.length - 1);
    return plaintext.toString('utf8');
}


function checkedUrl(value, domains) {
  const url = cleanUrl(value);
  const match = /^https:\/\/([a-z0-9.-]+)(?::443)?(?:[/?#]|$)/i.exec(url);
  const host = match && match[1].toLowerCase();
  if (!host || /[\s\\\u0000-\u001f\u007f]/.test(url)
    || !domains.some(domain => host === domain || host.endsWith('.' + domain))) {
    throw Object.assign(new Error('红果返回了不受支持的服务地址'), { code: 'SECURITY_BLOCKED' });
  }
  return url;
}
async function requestJson(url, options, deadline) {
  url = checkedUrl(url, ['fqnovel.com', 'snssdk.com']);
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new Error('红果片源请求超时');
  const value = await requestJSON(url, Object.assign({}, options, { timeout: Math.max(1, Math.ceil(remaining / 1000)) }));
  if (Date.now() > deadline) throw new Error('红果片源请求超时');
  return value;
}

async function fetchAppPlayUrl(vid, options = {}) {
    const requestedQuality = normalizeDownloadQuality(options.quality);
    vid = String(vid || '');
    if (!/^\d{1,30}$/.test(vid)) throw new Error('分集编号无效');
    const deadline = Date.now() + 12000;
    const payload = JSON.stringify({
        biz_param: { detail_page_version: 0, device_level: 3, disable_digg_stat: false, need_all_video_definition: true, need_mp4_align: false, use_os_player: false, use_server_dns: false, video_platform: 1024 },
        mixed_video_id_map: { '1004': [vid] },
    });
    const signed = signedVideoRequest(payload);
    const response = await requestJson(signed.url, { method: 'POST', headers: signed.headers, body: signed.body.toString('utf8') }, deadline);
    if (Number(response.Code || response.code || 0) !== 0) throw Object.assign(new Error('App 接口暂未提供本集播放信息'), { code: 'BUSINESS_REJECTED' });
    const entry = response.data?.[vid];
    const model = typeof entry?.video_model === 'string' ? jsonBody(entry.video_model) : entry?.video_model;
    if (!model) throw Object.assign(new Error('App 接口未返回所选分集，已停止取址'), { code: entry?.video_model ? 'INVALID_RESPONSE' : 'MISSING_MODEL' });
    const fallback = parseFallback(model.fallback_api);
    if (!fallback) throw Object.assign(new Error('App 接口未返回本集片源地址'), { code: 'MISSING_MODEL' });
    const outer = await requestJson(fallback, { headers: { 'User-Agent': VIDEO_UA } }, deadline);
    if ([outer, outer.video_info].some(value => Number(value?.Code || value?.code || 0) !== 0)) {
        throw Object.assign(new Error('App 接口暂未提供本集播放信息'), { code: 'BUSINESS_REJECTED' });
    }
    const info = outer?.video_info?.data;
    if (!info) throw Object.assign(new Error('App 接口未返回本集片源模型'), { code: 'MISSING_MODEL' });
    const rows = Object.values(info?.video_list || {}).filter(item => item && (item.main_url || item.backup_url || Array.isArray(item.backup_url_list))).map(item => {
        const codec = str(item.codec_type || item.video_meta?.codec_type).toLowerCase();
        const codecRank = ['h264', 'avc', 'avc1'].includes(codec) ? 0 : ['hevc', 'h265', 'hvc1', 'hev1', 'bytevc1'].includes(codec) ? 1 : 2;
        const quality = str(item.quality_desc || item.definition || item.height || item.vheight || item.video_meta?.definition);
        const pixels = Number(quality.match(/\d+/)?.[0] || 0);
        const meta = item.video_meta || {};
        const [width, height] = [[item.vwidth, item.vheight], [item.width, item.height], [meta.vwidth, meta.vheight], [meta.width, meta.height]]
            .map(pair => pair.map(Number)).find(pair => pair.every(value => Number.isFinite(value) && value > 0)) || [0, 0];
        return { item, codec, codecRank, quality, pixels, width, height };
    }).filter(row => row.codecRank < 2 && meetsDownloadQuality(row, requestedQuality)).sort((a, b) => requestedQuality === 'auto'
        ? a.codecRank - b.codecRank || b.pixels - a.pixels
        : Math.min(a.width, a.height) - Math.min(b.width, b.height) || a.codecRank - b.codecRank);
    if (!rows.length) throw new Error(requestedQuality === 'auto'
        ? '本集暂未提供兼容的 H.264/HEVC 片源'
        : `本集暂无尺寸可确认且满足 ${requestedQuality} 的 H.264/HEVC 片源，未降级下载`);
    let lastError;
    const variants = [];
    const seen = new Set();
    for (const selected of rows) {
        try {
            const spade = selected.item.spade_a || selected.item.encrypt_info?.spade_a;
            const key = spade ? deriveContentKey(spade) : null;
            for (const candidate of [selected.item.main_url, selected.item.backup_url, ...(Array.isArray(selected.item.backup_url_list) ? selected.item.backup_url_list : [])]) {
                if (typeof candidate !== 'string' || !candidate) continue;
                try {
                    const media = info.key_seed
                        ? decryptSpadeUrl(candidate, HGBytes.from(info.key_seed, 'base64'))
                        : cleanUrl(candidate);
                    const url = checkedUrl(media, ['qznovelvod.com', 'fqnovelvod.com', 'douyinvod.com']);
                    const contentKey = key ? key.toString('hex') : null;
                    const identity = `${url}:${contentKey || ''}`;
                    if (seen.has(identity)) continue;
                    seen.add(identity);
                    variants.push({ url, contentKey, codec: selected.codec === 'bytevc1' ? 'hevc' : selected.codec, source: 'app', vid,
                        userAgent: VIDEO_UA, referer: 'https://novelquickapp.com/', quality: requestedQuality === 'auto' ? selected.quality : requestedQuality,
                        ...(requestedQuality === 'auto' ? {} : { width: selected.width, height: selected.height }) });
                } catch (error) { lastError = error; }
            }
        } catch (error) { lastError = error; }
    }
    if (variants.length) return { ...variants[0], variants };
    throw lastError?.code === 'SECURITY_BLOCKED' ? lastError
        : Object.assign(new Error('本集片源地址或密钥无法解析'), { code: 'INVALID_RESPONSE' });
}


return { fetchAppPlayUrl };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getManifest,
    getHome,
    getHomeSection,
    getCategory,
    getDetail,
    getResourceVersions,
    resolvePlayback,
    search
  };
}
