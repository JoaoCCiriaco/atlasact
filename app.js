import { FLAGS, LEVELS, OBLIGATIONS, classify } from './rules.js';
const KEY = 'atlasact:systems';
const LABELS = { prohibited: 'Prohibited', high: 'High risk', limited: 'Limited risk', minimal: 'Minimal risk' };
const GROUPS = { prohibited: 'Prohibited practices', high: 'High-risk uses', limited: 'Transparency duties' };
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (id) => document.getElementById(id);
const li = (a) => `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join('') || '<li>None</li>'}</ul>`;
let systems = load();

$('flags').innerHTML = Object.keys(GROUPS).map((t) =>
  `<fieldset><legend>${GROUPS[t]}</legend>${FLAGS.filter((f) => f.tier === t).map((f) =>
    `<label><input type="checkbox" value="${f.id}"><span>${esc(f.label)}</span></label>`).join('')}</fieldset>`).join('')
  + '<p class="hint">Leave everything unchecked if none apply (minimal risk).</p>';

$('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const flags = [...document.querySelectorAll('#flags input:checked')].map((i) => i.value);
  systems.push({ id: Date.now(), name: $('name').value.trim(), purpose: $('purpose').value.trim(), flags, ...classify(flags) });
  save(systems); e.target.reset(); render();
});

$('rows').addEventListener('click', (e) => {
  const id = e.target.dataset.del;
  if (id) { systems = systems.filter((s) => String(s.id) !== id); save(systems); render(); }
});

$('export').addEventListener('click', () => {
  const md = ['# AI Act inventory', '', ...systems.flatMap((s) => [
    `## ${s.name} (${LABELS[s.level]})`, s.purpose ? `Purpose: ${s.purpose}` : '',
    'Basis:', ...(s.reasons.length ? s.reasons.map((r) => `- ${r}`) : ['- No high-risk or transparency criteria selected']),
    'Obligations:', ...OBLIGATIONS[s.level].map((o) => `- ${o}`), ''])].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }));
  a.download = 'atlasact-inventory.md'; a.click(); URL.revokeObjectURL(a.href);
});

function render() {
  const count = (l) => systems.filter((s) => s.level === l).length;
  $('total').textContent = `${systems.length} AI system${systems.length === 1 ? '' : 's'} registered`;
  $('bar').innerHTML = LEVELS.filter(count).map((l) => `<span class="seg ${l}" style="flex:${count(l)}"></span>`).join('');
  $('bar').setAttribute('aria-label', LEVELS.map((l) => `${LABELS[l]}: ${count(l)}`).join(', '));
  $('legend').innerHTML = LEVELS.map((l) => `<li><i class="dot ${l}"></i>${LABELS[l]}<b>${count(l)}</b></li>`).join('');
  $('rows').innerHTML = systems.map((s) => `<tr>
    <th scope="row">${esc(s.name)}<small>${esc(s.purpose)}</small></th>
    <td><span class="lvl"><i class="dot ${s.level}"></i>${LABELS[s.level]}</span></td>
    <td>${li(s.reasons)}</td><td>${li(OBLIGATIONS[s.level])}</td>
    <td><button class="link" data-del="${s.id}" aria-label="Remove ${esc(s.name)}">Remove</button></td></tr>`).join('');
  $('tablewrap').hidden = !systems.length;
  $('empty').hidden = systems.length > 0;
  $('export').disabled = !systems.length;
}
render();
