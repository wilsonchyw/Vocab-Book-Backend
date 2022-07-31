import { Parser } from "json2csv"
import { Vocab } from 'src/entity/Vocab';

const fields = [{
    label: 'type',
    value: 'type'
}, {
    label: 'meaning',
    value: 'meaning'
}, {
    label: 'vocabulary',
    value: 'vocabulary'
}, {
    label: 'createAt',
    value: 'createAt'
}, {
    label: 'example',
    value: 'example'
}, {
    label: 'verb',
    value: 'verb'
}, {
    label: 'verb_meaning',
    value: 'verb_meaning'
}, {
    label: 'noun',
    value: 'noun'
}, {
    label: 'noun_meaning',
    value: 'noun_meaning'
}, {
    label: 'adjective',
    value: 'adjective'
}, {
    label: 'adjective_meaning',
    value: 'adjective_meaning'
}, {
    label: 'adverb',
    value: 'adverb'
}, {
    label: 'adverb_meaning',
    value: 'adverb_meaning'
}]
function exprtCSV(vocabs:Vocab[]) {
    const _vocabs = vocabs.map(vocab => {
        try {
            let inf = JSON.parse(vocab.inflection)
            for (let i of ["verb", "noun", "adjective", "adverb"]) {
                vocab[i] = inf[i].vocab || null
                vocab[i + "_meaning"] = inf[i].meaning || null
            }
            return vocab
        } catch {
            return {
                ...vocab, verb: null,
                verb_meaning: null,
                noun: null,
                noun_meaning: null,
                adjective: null,
                adjective_meaning: null,
                adverb: null,
                adverb_meaning: null
            }
        }
    })
    const json2csv = new Parser({ fields: fields })
    return json2csv.parse(_vocabs)    
}

export default exprtCSV