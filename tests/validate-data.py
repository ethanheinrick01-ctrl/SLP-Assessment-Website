import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
existing=json.loads((root/'docs/evidence-existing.json').read_text())['assessments']
expanded=json.loads((root/'docs/expanded-assessments.json').read_text())['assessments']
guidance=json.loads((root/'docs/asha-guidance.json').read_text())['guidance']
all_tests=existing+expanded
expected={'PPVT-5','CELF-5','PLS-5','GFTA-3','KLPA-3','CAAP-2','TNL-2','OASES','WAB-R','CLQT+','CADL-3','CASL-2','OWLS-II','REEL-4','Bayley-III','Arizona-4','KSPT','PLS-5-Spanish','CELF-4-Spanish'}
assert len(all_tests)==19
assert {t['id'] for t in all_tests}==expected
new_ids={'CASL-2','OWLS-II','REEL-4','Bayley-III','Arizona-4','KSPT','PLS-5-Spanish','CELF-4-Spanish'}
required={'age','time','internal','retest','rater','overall','accuracy','norms','population','response','limit','scope'}
count=0
for test in all_tests:
    keys=[r['key'] for r in test['records']]
    assert len(keys)==len(set(keys)),test['id']
    assert required.issubset(keys),(test['id'],required-set(keys))
    sources={s['id']:s for s in test['sources']}
    for record in test['records']:
        assert record['checked_on'] in {'2026-10-02','2026-10-03'}
        if test['id'] in new_ids: assert record['checked_on']=='2026-10-03'
        assert record['status'] in {'source-checked','conflicting','not-reported','inherited'}
        assert all(s in sources for s in record['source_ids']),(test['id'],record['key'])
        if record['status']=='source-checked': assert record['source_ids'],(test['id'],record['key'])
        count+=1
    for source in sources.values():
        assert source['type'] in {'publisher','research','review','manual','asha'}
        assert source['url'] is None or source['url'].startswith('https://')
    if test['id'] in new_ids:
        assert 0 <= test['ageMin'] <= test['ageMax']
        assert (test['timeMin'] is None)==(test['timeMax'] is None)
        if test['timeMin'] is not None: assert 0 < test['timeMin'] <= test['timeMax']
for g in guidance:
    assert g['portal']['url'].startswith('https://www.asha.org/')
    assert g['evidence_map']['url'].startswith('https://apps.asha.org/')
    for c in g['components']: assert c['source_url'].startswith('https://www.asha.org/')
# Prevent known clinical denominator/method mixups.
cadl=next(t for t in expanded if t['id']=='CADL-3')
assert next(r for r in cadl['records'] if r['key']=='retest')['sample_size'] is None
wab=next(t for t in expanded if t['id']=='WAB-R')
assert '.942' in wab['overall'] and '.942' not in wab['internal'] and '.942' not in wab['retest']
tnl=next(t for t in expanded if t['id']=='TNL-2')
assert next(r for r in tnl['records'] if r['key']=='age')['status']=='conflicting'
# Guard edition, language, and study-design distinctions in the additions.
by_id={t['id']:t for t in all_tests}
get_record=lambda id,key:next(r for r in by_id[id]['records'] if r['key']==key)
for id in {'PLS-5-Spanish','CELF-4-Spanish'}:
    assert all(s.startswith(id+'-') for r in by_id[id]['records'] for s in r['source_ids'])
assert get_record('CELF-4-Spanish','accuracy')['status']=='conflicting'
assert get_record('CELF-4-Spanish','accuracy')['sample_size']==293
assert by_id['CELF-4-Spanish']['timeMax'] is None
assert 'Form A' in by_id['OWLS-II']['age'] and 'Form B' in by_id['OWLS-II']['age']
assert 'battery' in by_id['Bayley-III']['time'] and get_record('Bayley-III','norms')['sample_size']==1700
assert 'remote' in get_record('CASL-2','mode-agreement')['method']
assert 'same-mode' in get_record('CASL-2','mode-agreement')['note']
assert 'WPS Level C' in by_id['CASL-2']['qualification'] and 'Level B' in by_id['CASL-2']['qualification']
assert get_record('Arizona-4','norms')['sample_size']==3192
assert get_record('Arizona-4','accuracy')['sample_size']==50
assert '447' in get_record('KSPT','norms')['value'] and '2026' in by_id['KSPT']['edition']
print(f'PASS: 19 assessments, {count} records, valid source references, 7 ASHA groups, and clinical context checks.')

# Personal audit protects known method and denominator distinctions.
assert get_record('WAB-R','retest')['sample_size']==10
assert '23 paired' in get_record('WAB-R','overall')['sample_size']
assert get_record('PLS-5-Spanish','accuracy')['cutoff'] is None
assert get_record('CELF-4-Spanish','retest')['sample_size']==132
assert get_record('KLPA-3','rater')['status']=='conflicting'
