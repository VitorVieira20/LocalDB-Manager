# DESIGN SYSTEM - LocalDB Manager

## 1. Design Principles
* **Developer-First:** Clean, distraction-free interface. High data density without feeling cluttered.
* **Futuristic & Modern:** Deep backgrounds, subtle glowing accents, crisp typography, and smooth transitions.
* **Clear State Indication:** Since we are managing background processes (Docker), the system states (Running, Stopped, Loading, Error) must be instantly recognizable at a glance.

## 2. Color Palette (Light & Dark Mode)
The application relies heavily on CSS variables to seamlessly switch between themes. The primary accent is an "Electric Blue" that feels modern and tech-oriented.

### 2.1. Backgrounds & Surfaces
| Token | Light Mode (Hex) | Dark Mode (Hex) | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-base` | `#F8FAFC` (Slate 50) | `#0B1120` (Deep Blue/Black) | Main application window background |
| `--bg-surface` | `#FFFFFF` (White) | `#111827` (Dark Slate) | Cards, Modals, and List Items |
| `--bg-surface-hover` | `#F1F5F9` (Slate 100) | `#1F2937` (Slate 800) | Hover states on interactive surfaces |
| `--border-color` | `#E2E8F0` (Slate 200) | `#374151` (Slate 700) | Dividers, card outlines, input borders |

### 2.2. Typography Colors
| Token | Light Mode (Hex) | Dark Mode (Hex) | Usage |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Headings, primary labels |
| `--text-secondary`| `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Subtitles, helper text, empty states |

### 2.3. Brand & Accent Colors (Futuristic Blue)
These remain consistent across both themes to maintain brand identity.
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--accent-primary` | `#00D4FF` (Electric Cyan) | Main buttons, active tabs, toggle switches |
| `--accent-hover` | `#00B8D4` (Deep Cyan) | Hover state for primary buttons |
| `--accent-glow` | `rgba(0, 212, 255, 0.4)` | Subtle box-shadow for active focused elements |

### 2.4. Semantic Colors (Database States)
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--state-running` | `#10B981` (Emerald Green) | "Running" badge, success messages |
| `--state-stopped` | `#64748B` (Slate 500) | "Stopped" badge, offline indicators |
| `--state-error` | `#EF4444` (Red) | Delete buttons, error alerts, failed containers |
| `--state-warning` | `#F59E0B` (Amber) | Pending actions, loading/starting states |

## 3. Typography
We use two distinct font families to separate UI from technical data.

* **UI Font (Sans-Serif):** `Inter` or system default (`San Francisco`, `Segoe UI`).
  * Used for all menus, buttons, and descriptions.
* **Code Font (Monospace):** `JetBrains Mono` or `Fira Code`.
  * Used exclusively for: Passwords, Port numbers (e.g., `3306`), Container IDs, and Logs.

## 4. UI/UX Elements & Components

### 4.1. Buttons
* **Primary Button:** Solid `--accent-primary` background, dark text, subtle `--accent-glow` shadow.
* **Secondary Button:** Transparent background, `--border-color` outline, `--text-primary` text.
* **Danger Button (Delete):** Ghost button by default (transparent, red text) that turns solid red on hover to prevent accidental clicks.
* **Corner Radius:** `6px` for a modern, crisp feel (not too round, not completely sharp).

### 4.2. Database Instance Card (List Item)
Each database project should be displayed as a card containing:
1. **Status Indicator:** A glowing dot (Green for Running, Gray for Stopped).
2. **Project Name:** Bold UI Font.
3. **Connection Details:** Mapped ports displayed in Monospace font (e.g., `MySQL: 3306 | PMA: 8080`).
4. **Action Bar:** "Start/Stop" button, "Open phpMyAdmin" button, and a discreet "Trash" icon.

### 4.3. Inputs & Forms
* Inputs should have a solid `--bg-surface` background with a subtle border.
* On `:focus`, the border color changes to `--accent-primary` with a subtle `--accent-glow` box-shadow to indicate the active element clearly.

## 5. Animation & Transitions
* Keep it snappy. Programmers hate slow animations.
* **Transition Speed:** `150ms` to `200ms` `ease-in-out` for hover states and mode switching.
* Use skeleton loaders or spinning indicators instead of blocking the screen when Docker commands are executing.