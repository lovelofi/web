import { DEMO_PRESETS, type DemoPreset, type PresetEffects } from './constants';

/**
 * Full Web Audio engine for the landing page demo.
 * All 12 effects — identical chain and parameter mappings as the extension.
 * AudioWorklet processors are inlined as Blob URLs (no separate files needed).
 */

// ─── AudioWorklet processor source (inlined from extension's public/worklets/) ───

const BITCRUSHER_PROCESSOR = `
class BitcrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bitDepth', defaultValue: 16, minValue: 4, maxValue: 16 },
      { name: 'sampleRateReduction', defaultValue: 1, minValue: 1, maxValue: 40 },
    ];
  }
  constructor() { super(); this._lastSample = new Float32Array(2); this._sampleCounter = 0; }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input || !input.length) return true;
    const bitDepth = parameters.bitDepth;
    const reduction = parameters.sampleRateReduction;
    for (let ch = 0; ch < output.length; ch++) {
      const inp = input[ch] || input[0]; const out = output[ch];
      for (let i = 0; i < out.length; i++) {
        const bits = bitDepth.length > 1 ? bitDepth[i] : bitDepth[0];
        const red = reduction.length > 1 ? reduction[i] : reduction[0];
        this._sampleCounter++;
        if (this._sampleCounter >= red) {
          this._sampleCounter = 0;
          const levels = Math.pow(2, bits);
          this._lastSample[ch] = Math.round(inp[i] * levels) / levels;
        }
        out[i] = this._lastSample[ch] || 0;
      }
    }
    return true;
  }
}
registerProcessor('bitcrusher-processor', BitcrusherProcessor);
`;

const PITCH_WOBBLE_PROCESSOR = `
class PitchWobbleProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'speed', defaultValue: 0.5, minValue: 0.1, maxValue: 5 },
      { name: 'depth', defaultValue: 0, minValue: 0, maxValue: 20 },
    ];
  }
  constructor() {
    super();
    this._bufferSize = 4800;
    this._buffer = [new Float32Array(4800), new Float32Array(4800)];
    this._writePos = 0; this._phase = 0;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input || !input.length) return true;
    const speed = parameters.speed; const depth = parameters.depth;
    for (let i = 0; i < output[0].length; i++) {
      const spd = speed.length > 1 ? speed[i] : speed[0];
      const dep = depth.length > 1 ? depth[i] : depth[0];
      const lfo = Math.sin(this._phase * 2 * Math.PI);
      this._phase += spd / sampleRate;
      if (this._phase >= 1) this._phase -= 1;
      const delaySamples = ((dep * sampleRate) / 1000) * (0.5 + 0.5 * lfo);
      for (let ch = 0; ch < output.length; ch++) {
        const inp = input[ch] || input[0]; const buf = this._buffer[ch] || this._buffer[0];
        buf[this._writePos % this._bufferSize] = inp[i];
        const readPos = this._writePos - delaySamples + this._bufferSize * 2;
        const idx = Math.floor(readPos) % this._bufferSize;
        const frac = readPos - Math.floor(readPos);
        output[ch][i] = buf[idx] * (1 - frac) + buf[(idx + 1) % this._bufferSize] * frac;
      }
      this._writePos = (this._writePos + 1) % this._bufferSize;
    }
    return true;
  }
}
registerProcessor('pitch-wobble-processor', PitchWobbleProcessor);
`;

const STEREO_DRIFT_PROCESSOR = `
class StereoDriftProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'speed', defaultValue: 0.1, minValue: 0.01, maxValue: 1 },
      { name: 'depth', defaultValue: 0, minValue: 0, maxValue: 0.5 },
    ];
  }
  constructor() { super(); this._phaseL = 0; this._phaseR = Math.PI * 0.7; }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input.length || !output.length) return true;
    const speed = parameters.speed[0] || 0.1;
    const depth = parameters.depth[0] || 0;
    const inc = (speed * 2 * Math.PI) / sampleRate;
    for (let i = 0; i < input[0].length; i++) {
      const gL = 1 - depth * (0.5 + 0.5 * Math.sin(this._phaseL));
      const gR = 1 - depth * (0.5 + 0.5 * Math.sin(this._phaseR));
      if (input[0]) output[0][i] = (input[0][i] || 0) * gL;
      if (input.length > 1 && output.length > 1) output[1][i] = (input[1][i] || 0) * gR;
      else if (output.length > 1 && input[0]) output[1][i] = (input[0][i] || 0) * gR;
      this._phaseL += inc; this._phaseR += inc * 1.3;
    }
    if (this._phaseL > 2 * Math.PI) this._phaseL -= 2 * Math.PI;
    if (this._phaseR > 2 * Math.PI) this._phaseR -= 2 * Math.PI;
    return true;
  }
}
registerProcessor('stereo-drift-processor', StereoDriftProcessor);
`;

const DROPOUT_PROCESSOR = `
class DropoutProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 0, minValue: 0, maxValue: 0.01 },
      { name: 'duration', defaultValue: 0.02, minValue: 0, maxValue: 0.1 },
    ];
  }
  constructor() { super(); this._dropping = false; this._dropSamplesLeft = 0; this._fadeLength = 64; this._fadeSample = 0; }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input.length || !output.length) return true;
    const freq = parameters.frequency[0] || 0;
    const dur = parameters.duration[0] || 0.02;
    for (let i = 0; i < input[0].length; i++) {
      if (!this._dropping && freq > 0 && Math.random() < freq) {
        this._dropping = true; this._dropSamplesLeft = Math.floor(dur * sampleRate); this._fadeSample = 0;
      }
      let gain = 1;
      if (this._dropping) {
        if (this._fadeSample < this._fadeLength) { gain = 1 - this._fadeSample / this._fadeLength; this._fadeSample++; }
        else if (this._dropSamplesLeft > this._fadeLength) gain = 0;
        else if (this._dropSamplesLeft > 0) gain = 1 - this._dropSamplesLeft / this._fadeLength;
        else { gain = 1; this._dropping = false; }
        this._dropSamplesLeft--;
      }
      for (let ch = 0; ch < output.length; ch++) output[ch][i] = (input[ch] ? input[ch][i] : 0) * gain;
    }
    return true;
  }
}
registerProcessor('dropout-processor', DropoutProcessor);
`;

const SLOWDOWN_PROCESSOR = `
class SlowdownProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'rate', defaultValue: 1.0, minValue: 0.5, maxValue: 1.0 }];
  }
  constructor() {
    super(); this._bufferSize = 131072;
    this._bufferL = new Float32Array(131072); this._bufferR = new Float32Array(131072);
    this._writePos = 0; this._readPos = 0;
  }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input || !input.length) return true;
    const inL = input[0]; const inR = input[1] || input[0];
    const outL = output[0]; const outR = output[1] || output[0];
    const rate = parameters.rate;
    for (let i = 0; i < outL.length; i++) {
      const r = rate.length > 1 ? rate[i] : rate[0];
      this._bufferL[this._writePos] = inL[i]; this._bufferR[this._writePos] = inR[i];
      this._writePos = (this._writePos + 1) % this._bufferSize;
      if (r >= 0.999) { outL[i] = inL[i]; outR[i] = inR[i]; this._readPos = this._writePos; continue; }
      this._readPos += r;
      if (this._readPos >= this._bufferSize) this._readPos -= this._bufferSize;
      const dist = (this._writePos - this._readPos + this._bufferSize) % this._bufferSize;
      if (dist > this._bufferSize - 4096) this._readPos = (this._writePos - 4096 + this._bufferSize) % this._bufferSize;
      const fl = Math.floor(this._readPos); const frac = this._readPos - fl;
      const i0 = fl % this._bufferSize; const i1 = (fl + 1) % this._bufferSize;
      outL[i] = this._bufferL[i0] * (1 - frac) + this._bufferL[i1] * frac;
      outR[i] = this._bufferR[i0] * (1 - frac) + this._bufferR[i1] * frac;
    }
    return true;
  }
}
registerProcessor('slowdown-processor', SlowdownProcessor);
`;

const VOCAL_CUT_PROCESSOR = `
class VocalCutProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'amount', defaultValue: 0, minValue: 0, maxValue: 1 },
      { name: 'lowFreq', defaultValue: 200, minValue: 80, maxValue: 500 },
      { name: 'highFreq', defaultValue: 5000, minValue: 2000, maxValue: 8000 },
    ];
  }
  constructor() { super(); this._lpState = 0; this._hpState = 0; }
  process(inputs, outputs, parameters) {
    const input = inputs[0]; const output = outputs[0];
    if (!input.length || !output.length) return true;
    const amount = parameters.amount[0] || 0;
    if (amount === 0 || input.length < 2 || output.length < 2) {
      for (let ch = 0; ch < input.length; ch++) if (output[ch]) output[ch].set(input[ch]);
      return true;
    }
    const left = input[0]; const right = input[1]; const outL = output[0]; const outR = output[1];
    const lpC = Math.exp(-2 * Math.PI * (parameters.highFreq[0] || 5000) / sampleRate);
    const hpC = Math.exp(-2 * Math.PI * (parameters.lowFreq[0] || 200) / sampleRate);
    for (let i = 0; i < left.length; i++) {
      const mid = (left[i] + right[i]) * 0.5;
      this._lpState = this._lpState * lpC + mid * (1 - lpC);
      this._hpState = this._hpState * hpC + this._lpState * (1 - hpC);
      const vocal = this._lpState - this._hpState;
      outL[i] = left[i] - vocal * amount;
      outR[i] = right[i] - vocal * amount;
    }
    return true;
  }
}
registerProcessor('vocal-cut-processor', VocalCutProcessor);
`;

// ─── Helpers ───

function createWorkletBlobURL(code: string): string {
	return URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
}

function makeSatCurve(drive: number): Float32Array<ArrayBuffer> {
	const n = 8192;
	const curve = new Float32Array(n);
	for (let i = 0; i < n; i++) curve[i] = Math.tanh(((i / (n - 1)) * 2 - 1) * drive);
	return curve;
}

function generateIR(audioCtx: AudioContext): AudioBuffer {
	const sr = audioCtx.sampleRate;
	const len = sr * 2.5;
	const buf = audioCtx.createBuffer(2, len, sr);
	for (let ch = 0; ch < 2; ch++) {
		const d = buf.getChannelData(ch);
		for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-3.5 * (i / sr));
	}
	return buf;
}

function generateCrackleBuffer(audioCtx: AudioContext): AudioBuffer {
	const sr = audioCtx.sampleRate;
	const len = sr * 4;
	const buf = audioCtx.createBuffer(2, len, sr);
	for (let ch = 0; ch < 2; ch++) {
		const d = buf.getChannelData(ch);
		for (let i = 0; i < len; i++) {
			let s = (Math.random() * 2 - 1) * 0.05;
			if (Math.random() < 0.002) s += (Math.random() * 2 - 1) * 0.7;
			else if (Math.random() < 0.01) s += (Math.random() * 2 - 1) * 0.3;
			d[i] = s;
		}
	}
	return buf;
}

// ─── Node state ───

let ctx: AudioContext | null = null;
let audioElement: HTMLAudioElement | null = null;
let source: MediaElementAudioSourceNode | null = null;
let _initialized = false;
let blobURLs: string[] = [];

// Native nodes
let lowPassFilter: BiquadFilterNode | null = null;
let highPassFilter: BiquadFilterNode | null = null;
let satPreGain: GainNode | null = null;
let satShaper: WaveShaperNode | null = null;
let satPostGain: GainNode | null = null;
let reverbConvolver: ConvolverNode | null = null;
let reverbDry: GainNode | null = null;
let reverbWet: GainNode | null = null;
let chorusDry: GainNode | null = null;
let chorusWet: GainNode | null = null;
let chorusDelay1: DelayNode | null = null;
let chorusDelay2: DelayNode | null = null;
let chorusLfo1: OscillatorNode | null = null;
let chorusLfo2: OscillatorNode | null = null;
let chorusLfoGain1: GainNode | null = null;
let chorusLfoGain2: GainNode | null = null;
let crackleSource: AudioBufferSourceNode | null = null;
let crackleGain: GainNode | null = null;
let crackleBuffer: AudioBuffer | null = null;
let outputGain: GainNode | null = null;

// AudioWorklet nodes
let bitcrusherNode: AudioWorkletNode | null = null;
let pitchWobbleNode: AudioWorkletNode | null = null;
let stereoDriftNode: AudioWorkletNode | null = null;
let dropoutNode: AudioWorkletNode | null = null;
let slowdownNode: AudioWorkletNode | null = null;
let vocalCutNode: AudioWorkletNode | null = null;

// Reactive state
let isPlaying = $state(false);
let currentPresetId = $state('off');
let currentPresetName = $state(DEMO_PRESETS[0]?.name ?? 'Clean');
let currentPresetDescription = $state(DEMO_PRESETS[0]?.description ?? 'No effects');
let currentEffects = $state<PresetEffects>(DEMO_PRESETS[0]?.effects ?? ({} as PresetEffects));
let currentCollectionName = $state<string | null>(null);
let volume = $state(0.75);

// ─── Effect application (matching extension's setIntensity methods exactly) ───

function applyLowPass(enabled: boolean, intensity: number) {
	if (!lowPassFilter) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		lowPassFilter.frequency.value = 4000 - n * 3600;
		lowPassFilter.Q.value = 1 + n * 4;
	} else {
		lowPassFilter.frequency.value = 20000;
		lowPassFilter.Q.value = 0.7;
	}
}

function applyHighPass(enabled: boolean, intensity: number) {
	if (!highPassFilter) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		highPassFilter.frequency.value = 20 + n * 780;
		highPassFilter.Q.value = 0.7 + n * 2;
	} else {
		highPassFilter.frequency.value = 20;
		highPassFilter.Q.value = 0.7;
	}
}

function applyVocalCut(enabled: boolean, intensity: number) {
	if (!vocalCutNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		vocalCutNode.parameters.get('amount')!.value = n;
		vocalCutNode.parameters.get('lowFreq')!.value = 300 - n * 150;
		vocalCutNode.parameters.get('highFreq')!.value = 3000 + n * 3000;
	} else {
		vocalCutNode.parameters.get('amount')!.value = 0;
	}
}

function applyTapeSaturation(enabled: boolean, intensity: number) {
	if (!satShaper || !satPreGain || !satPostGain) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		satShaper.curve = makeSatCurve(1 + n * 5);
		satPreGain.gain.value = 1 + n * 0.5;
		satPostGain.gain.value = 1 / (1 + n * 0.3);
	} else {
		satShaper.curve = makeSatCurve(1);
		satPreGain.gain.value = 1;
		satPostGain.gain.value = 1;
	}
}

function applyBitcrusher(enabled: boolean, intensity: number) {
	if (!bitcrusherNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		bitcrusherNode.parameters.get('bitDepth')!.value = 16 - n * 12;
		bitcrusherNode.parameters.get('sampleRateReduction')!.value = 1 + n * 19;
	} else {
		bitcrusherNode.parameters.get('bitDepth')!.value = 16;
		bitcrusherNode.parameters.get('sampleRateReduction')!.value = 1;
	}
}

function applyReverb(enabled: boolean, intensity: number) {
	if (!reverbDry || !reverbWet) return;
	if (enabled) {
		const wet = Math.max(0, Math.min(100, intensity)) / 100;
		reverbDry.gain.value = 1 - wet;
		reverbWet.gain.value = wet;
	} else {
		reverbDry.gain.value = 1;
		reverbWet.gain.value = 0;
	}
}

function applyChorus(enabled: boolean, intensity: number) {
	if (!chorusDry || !chorusWet || !chorusLfo1 || !chorusLfo2 || !chorusLfoGain1 || !chorusLfoGain2)
		return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		const wet = n * 0.6;
		chorusWet.gain.value = wet;
		chorusDry.gain.value = 1 - wet * 0.5;
		chorusLfoGain1.gain.value = n * 0.003;
		chorusLfoGain2.gain.value = n * 0.003;
		chorusLfo1.frequency.value = 0.3 + n * 1.2;
		chorusLfo2.frequency.value = 0.5 + n * 1.0;
	} else {
		chorusWet.gain.value = 0;
		chorusDry.gain.value = 1;
		chorusLfoGain1.gain.value = 0;
		chorusLfoGain2.gain.value = 0;
	}
}

function applyPitchWobble(enabled: boolean, intensity: number) {
	if (!pitchWobbleNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		pitchWobbleNode.parameters.get('speed')!.value = 0.3 + n * 2.7;
		pitchWobbleNode.parameters.get('depth')!.value = n * 20;
	} else {
		pitchWobbleNode.parameters.get('depth')!.value = 0;
	}
}

function applyStereoDrift(enabled: boolean, intensity: number) {
	if (!stereoDriftNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		stereoDriftNode.parameters.get('speed')!.value = 0.05 + n * 0.45;
		stereoDriftNode.parameters.get('depth')!.value = n * 0.4;
	} else {
		stereoDriftNode.parameters.get('depth')!.value = 0;
	}
}

function applyDropout(enabled: boolean, intensity: number) {
	if (!dropoutNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		dropoutNode.parameters.get('frequency')!.value = n * 0.005;
		dropoutNode.parameters.get('duration')!.value = n * 0.05;
	} else {
		dropoutNode.parameters.get('frequency')!.value = 0;
	}
}

function applySlowdown(enabled: boolean, intensity: number) {
	if (!slowdownNode) return;
	if (enabled) {
		const n = Math.max(0, Math.min(100, intensity)) / 100;
		slowdownNode.parameters.get('rate')!.value = 1.0 - n * 0.5;
	} else {
		slowdownNode.parameters.get('rate')!.value = 1.0;
	}
}

function applyVinylCrackle(enabled: boolean, intensity: number) {
	if (!crackleGain) return;
	if (enabled) {
		crackleGain.gain.value = (Math.max(0, Math.min(100, intensity)) / 100) * 0.5;
		if (!crackleSource && ctx && crackleBuffer) {
			crackleSource = ctx.createBufferSource();
			crackleSource.buffer = crackleBuffer;
			crackleSource.loop = true;
			crackleSource.connect(crackleGain);
			crackleSource.start();
		}
	} else {
		crackleGain.gain.value = 0;
	}
}

// ─── Public API ───

export function getDemoState() {
	return {
		get isPlaying() {
			return isPlaying;
		},
		get currentPresetId() {
			return currentPresetId;
		},
		get currentPresetName() {
			return currentPresetName;
		},
		get currentPresetDescription() {
			return currentPresetDescription;
		},
		get currentEffects() {
			return currentEffects;
		},
		get currentCollectionName() {
			return currentCollectionName;
		},
		get volume() {
			return volume;
		},

		async init(audio: HTMLAudioElement) {
			if (_initialized) return;
			audioElement = audio;
			ctx = new AudioContext();
			source = ctx.createMediaElementSource(audio);

			// Register AudioWorklet processors via Blob URLs
			for (const code of [
				BITCRUSHER_PROCESSOR,
				PITCH_WOBBLE_PROCESSOR,
				STEREO_DRIFT_PROCESSOR,
				DROPOUT_PROCESSOR,
				SLOWDOWN_PROCESSOR,
				VOCAL_CUT_PROCESSOR,
			]) {
				const url = createWorkletBlobURL(code);
				blobURLs.push(url);
				await ctx.audioWorklet.addModule(url);
			}

			// Create all nodes
			lowPassFilter = ctx.createBiquadFilter();
			lowPassFilter.type = 'lowpass';
			lowPassFilter.frequency.value = 20000;
			lowPassFilter.Q.value = 0.7;

			highPassFilter = ctx.createBiquadFilter();
			highPassFilter.type = 'highpass';
			highPassFilter.frequency.value = 20;
			highPassFilter.Q.value = 0.7;

			vocalCutNode = new AudioWorkletNode(ctx, 'vocal-cut-processor');

			satPreGain = ctx.createGain();
			satShaper = ctx.createWaveShaper();
			satShaper.oversample = '4x';
			satShaper.curve = makeSatCurve(1);
			satPostGain = ctx.createGain();

			bitcrusherNode = new AudioWorkletNode(ctx, 'bitcrusher-processor');

			reverbConvolver = ctx.createConvolver();
			reverbConvolver.buffer = generateIR(ctx);
			reverbDry = ctx.createGain();
			reverbWet = ctx.createGain();
			reverbWet.gain.value = 0;

			chorusDry = ctx.createGain();
			chorusWet = ctx.createGain();
			chorusWet.gain.value = 0;
			chorusDelay1 = ctx.createDelay(0.05);
			chorusDelay1.delayTime.value = 0.012;
			chorusDelay2 = ctx.createDelay(0.05);
			chorusDelay2.delayTime.value = 0.018;
			chorusLfo1 = ctx.createOscillator();
			chorusLfo1.frequency.value = 0.3;
			chorusLfo2 = ctx.createOscillator();
			chorusLfo2.frequency.value = 0.5;
			chorusLfoGain1 = ctx.createGain();
			chorusLfoGain1.gain.value = 0;
			chorusLfoGain2 = ctx.createGain();
			chorusLfoGain2.gain.value = 0;
			chorusLfo1.connect(chorusLfoGain1);
			chorusLfoGain1.connect(chorusDelay1.delayTime);
			chorusLfo2.connect(chorusLfoGain2);
			chorusLfoGain2.connect(chorusDelay2.delayTime);
			chorusLfo1.start();
			chorusLfo2.start();

			pitchWobbleNode = new AudioWorkletNode(ctx, 'pitch-wobble-processor');
			stereoDriftNode = new AudioWorkletNode(ctx, 'stereo-drift-processor');
			dropoutNode = new AudioWorkletNode(ctx, 'dropout-processor');
			slowdownNode = new AudioWorkletNode(ctx, 'slowdown-processor');

			crackleGain = ctx.createGain();
			crackleGain.gain.value = 0;
			crackleBuffer = generateCrackleBuffer(ctx);

			outputGain = ctx.createGain();
			outputGain.gain.value = volume;

			// === Wire the chain (identical order to extension's AudioEngine) ===
			// source → lowPass → highPass → vocalCut → satPre → shaper → satPost
			//   → bitcrusher → [reverb dry/wet] → [chorus dry/wet]
			//   → pitchWobble → stereoDrift → dropout → slowdown → outputGain → destination
			// vinylCrackle → outputGain (parallel)

			source.connect(lowPassFilter);
			lowPassFilter.connect(highPassFilter);
			highPassFilter.connect(vocalCutNode);
			vocalCutNode.connect(satPreGain);
			satPreGain.connect(satShaper);
			satShaper.connect(satPostGain);
			satPostGain.connect(bitcrusherNode);

			// Reverb (parallel dry/wet)
			const reverbMerge = ctx.createGain();
			bitcrusherNode.connect(reverbDry);
			bitcrusherNode.connect(reverbConvolver);
			reverbConvolver.connect(reverbWet);
			reverbDry.connect(reverbMerge);
			reverbWet.connect(reverbMerge);

			// Chorus (parallel dry/wet)
			const chorusMerge = ctx.createGain();
			reverbMerge.connect(chorusDry);
			reverbMerge.connect(chorusDelay1);
			reverbMerge.connect(chorusDelay2);
			chorusDelay1.connect(chorusWet);
			chorusDelay2.connect(chorusWet);
			chorusDry.connect(chorusMerge);
			chorusWet.connect(chorusMerge);

			// Remaining chain
			chorusMerge.connect(pitchWobbleNode);
			pitchWobbleNode.connect(stereoDriftNode);
			stereoDriftNode.connect(dropoutNode);
			dropoutNode.connect(slowdownNode);
			slowdownNode.connect(outputGain);

			// Vinyl crackle (parallel into output)
			crackleGain.connect(outputGain);

			outputGain.connect(ctx.destination);

			_initialized = true;
		},

		async play() {
			if (!audioElement || !ctx) return;
			if (ctx.state === 'suspended') await ctx.resume();
			try {
				await audioElement.play();
				isPlaying = true;
			} catch {
				// autoplay blocked
			}
		},

		pause() {
			if (!audioElement) return;
			audioElement.pause();
			isPlaying = false;
		},

		toggle() {
			if (isPlaying) this.pause();
			else this.play();
		},

		setVolume(v: number) {
			volume = v;
			if (outputGain) outputGain.gain.value = v;
		},

		applyPreset(preset: DemoPreset & { collectionName?: string | null }) {
			currentPresetId = preset.id;
			currentPresetName = preset.name;
			currentPresetDescription = preset.description;
			currentEffects = preset.effects;
			currentCollectionName = preset.collectionName ?? null;
			const e = preset.effects;
			applyLowPass(e.lowPass.enabled, e.lowPass.intensity);
			applyHighPass(e.highPass.enabled, e.highPass.intensity);
			applyVocalCut(e.vocalCut.enabled, e.vocalCut.intensity);
			applyTapeSaturation(e.tapeSaturation.enabled, e.tapeSaturation.intensity);
			applyBitcrusher(e.bitcrusher.enabled, e.bitcrusher.intensity);
			applyReverb(e.reverb.enabled, e.reverb.intensity);
			applyChorus(e.chorus.enabled, e.chorus.intensity);
			applyPitchWobble(e.pitchWobble.enabled, e.pitchWobble.intensity);
			applyStereoDrift(e.stereoDrift.enabled, e.stereoDrift.intensity);
			applyDropout(e.dropout.enabled, e.dropout.intensity);
			applySlowdown(e.slowdown.enabled, e.slowdown.intensity);
			applyVinylCrackle(e.vinylCrackle.enabled, e.vinylCrackle.intensity);
		},

		destroy() {
			if (crackleSource) { crackleSource.stop(); crackleSource.disconnect(); crackleSource = null; }
			if (chorusLfo1) { chorusLfo1.stop(); chorusLfo1 = null; }
			if (chorusLfo2) { chorusLfo2.stop(); chorusLfo2 = null; }
			if (audioElement) { audioElement.pause(); audioElement = null; }
			if (ctx) { ctx.close(); ctx = null; }
			for (const url of blobURLs) URL.revokeObjectURL(url);
			blobURLs = [];
			source = null;
			lowPassFilter = null;
			highPassFilter = null;
			satPreGain = null;
			satShaper = null;
			satPostGain = null;
			reverbConvolver = null;
			reverbDry = null;
			reverbWet = null;
			chorusDry = null;
			chorusWet = null;
			chorusDelay1 = null;
			chorusDelay2 = null;
			chorusLfoGain1 = null;
			chorusLfoGain2 = null;
			crackleGain = null;
			crackleBuffer = null;
			bitcrusherNode = null;
			pitchWobbleNode = null;
			stereoDriftNode = null;
			dropoutNode = null;
			slowdownNode = null;
			vocalCutNode = null;
			outputGain = null;
			_initialized = false;
			isPlaying = false;
			currentPresetId = 'off';
			currentPresetName = DEMO_PRESETS[0]?.name ?? 'Clean';
			currentPresetDescription = DEMO_PRESETS[0]?.description ?? 'No effects';
			currentEffects = DEMO_PRESETS[0]?.effects ?? ({} as PresetEffects);
			currentCollectionName = null;
		},
	};
}
