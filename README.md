# 🎡 SpinWheel

A fully customizable and responsive **React Spin Wheel Component** built with TypeScript. Supports smooth animations, audio feedback, sector-based labeling, and a modal to show the winning result. Ideal for lucky draw or reward-based UIs.

---

## ✨ Features

- 🎯 Customizable wheel sectors (colors, labels)
- ⏱️ Smooth easing animation with custom duration
- 🔊 Optional ticking sound on spin
- 📦 Modal popup with custom content
- 📐 Full TypeScript support
- 💅 Easily styleable with Tailwind or custom CSS

---

## 📦 Installation

Using **npm**:

```bash
npm install ts-spin-wheel
```

Using **yarn**:

```bash
yarn add ts-spin-wheel
```

---

## 🔧 Usage

```tsx
import React, { useRef } from 'react';
import SpinWheel, { SpinWheelHandle, Sector } from 'ts-spin-wheel';

const App = () => {
  const wheelRef = useRef<SpinWheelHandle>(null);

  const wheelData: Sector[] = [
    { label: '10% Off', color: '#C78970', text: '#fff' },
    { label: '20% Off', color: '#f87171', text: '#fff' },
    { label: '30% Off', color: '#60a5fa', text: '#fff' },
    { label: '40% Off', color: '#facc15', text: '#000' },
    { label: '50% Off', color: '#9acc15', text: '#000' },
  ];

  const triggerSpin = () => {
    if (wheelRef.current) {
      wheelRef.current.spin();
    }
  };

  const handleSpinEnd = (winner: Sector) => {
    console.log('Winner:', winner);
  };

  return (
    <div>
      <button onClick={triggerSpin}>
        Spin the Wheel!
      </button>

      <SpinWheel
        ref={wheelRef}
        sectors={wheelData}
        size={150}
        onSpinEnd={handleSpinEnd}
        spinButtonText="Spin"
        labelFontSize={12}
        spinButtonFontSize={10}
        spinButtonStyles={{
          boxShadow: '0 0 0 3px currentColor, 0 0px 15px 5px rgba(0, 0, 0, 0.6)',
          fontFamily: 'Lato, sans-serif',
          width: '30px',
          height: '30px',
          margin: '-15px',
        }}
        spinButtonArrowStyle={{
          top: '-9px',
          border: '8px solid transparent',
          borderBottomColor: '#fff',
        }}
        wheelBaseWidth="60%"
        wheelBaseBottom="4px"
        customModalContent={(winner, onClose) => (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-yellow-100 p-8 rounded-xl shadow-xl text-center">
              <h1 className="text-2xl font-bold text-green-700">
                🌟 You got: {winner.label}
              </h1>
              <p className="mt-2">Enjoy your reward!</p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default App;
```

---

## 🧩 Props

| Prop                   | Type                                                                 | Default              | Description                          |
|------------------------|----------------------------------------------------------------------|----------------------|--------------------------------------|
| `sectors`              | `Sector[]`                                                           | **required**         | List of sectors to display           |
| `size`                 | `number`                                                             | `300`                | Canvas size                          |
| `onSpinEnd`            | `(winner: Sector) => void`                                           | `() => {}`           | Callback after spinning stops        |
| `spinButtonText`       | `string \| (isSpinning: boolean, label: string) => string`           | `"SPIN"`             | Text or function for button          |
| `labelFontSize`        | `number`                                                             | `16`                 | Font size of sector labels           |
| `spinButtonFontSize`   | `number`                                                             | `16`                 | Font size of spin button             |
| `spinButtonStyles`     | `React.CSSProperties`                                                | `{}`                 | Style object for spin button         |
| `spinButtonArrowStyle` | `React.CSSProperties`                                                | `{}`                 | Style object for the arrow           |
| `spinButtonClassName`  | `string`                                                             | `""`                 | Additional class for spin button     |
| `spinButtonArrowColor` | `string`                                                             | `"#fff"`             | Color of the arrow                   |
| `wheelBaseWidth`       | `number \| string`                                                   | `"80%"`              | Width of the base image              |
| `wheelBaseBottom`      | `number \| string`                                                   | `"-45px"`            | Offset from bottom                   |
| `customModalContent`   | `(winner: Sector, onClose: () => void) => React.ReactNode`           | `undefined`          | Custom modal JSX                     |
| `enableSound`          | `boolean`                                                            | `true`               | Enable spinning sound                |
| `customSound`          | `string`                                                             | `defaultTickingSound`| URL to custom ticking sound          |
| `spinDuration`         | `number`                                                             | `5000`               | Duration of spin in milliseconds     |
| `easingFunction`       | `(t: number) => number`                                              | `easeOutCubic`       | Custom easing function               |

---

## 🎨 Styling

Use default Tailwind CSS classes or override with your own styles by targeting these classes:

- `.spin-button`
- `.spin-arrow`
- `.wheel-base-img`
- `.win-modal`

You can also override them using `spinButtonClassName`, `spinButtonStyles`, or custom CSS.

---

## 📁 Assets

Ensure the following assets are included in your project:

- `SpinBase.png` – Decorative wheel base
- `spin-wheel-sound.mp3` – Optional default spin sound

---

## 📜 License

MIT License © [Sivamaniyam](https://github.com/Sivamani-18)
