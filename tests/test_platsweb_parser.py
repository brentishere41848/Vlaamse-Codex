from __future__ import annotations

import pytest

from vlaamscodex.platsweb.parser import parse_plats_sfc, PlatsWebParseError


def test_sfc_parse_valid_minimal() -> None:
    src = """
pagina { blok { tekst tekst:"Hallo" } }
script { staat naam = "x" }
stijl { body { color: black; } }
    """.strip()
    sfc = parse_plats_sfc(src)
    assert "blok" in sfc.pagina.text
    assert "staat naam" in sfc.script.text
    assert "body" in sfc.stijl.text


def test_sfc_parse_valid_whitespace_order() -> None:
    src = """
script { staat naam = "" }

pagina {
  tekst tekst:"Hallo {{ naam }}"
}

stijl {
  body { margin: 0; }
}
    """.strip()
    sfc = parse_plats_sfc(src)
    assert "tekst" in sfc.pagina.text


def test_sfc_parse_valid_quotes_with_braces() -> None:
    src = r'''
pagina { tekst tekst:"{ niet als brace tellen }" }
script { staat naam = "}" }
stijl { body { content: "{}"; } }
    '''.strip()
    sfc = parse_plats_sfc(src)
    assert "niet als brace" in sfc.pagina.text


def test_sfc_parse_missing_section_fails() -> None:
    src = "pagina { tekst tekst:\"Hallo\" }"
    with pytest.raises(PlatsWebParseError):
        parse_plats_sfc(src)


def test_sfc_parse_unclosed_brace_fails() -> None:
    src = "pagina { tekst tekst:\"Hallo\" \nscript { staat x = 1 }\nstijl { }"
    with pytest.raises(PlatsWebParseError):
        parse_plats_sfc(src)


def test_sfc_parse_unknown_top_level_fails() -> None:
    src = "wat { } pagina { } script { } stijl { }"
    with pytest.raises(PlatsWebParseError):
        parse_plats_sfc(src)
