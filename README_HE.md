# ניהול תקציב משפחתי - תיק העבודה המלא

## 📦 מה כלול בחבילה הזו

קיבלת 11 קבצים שיעזרו לך לבנות את האפליקציה ולהשתלב עם n8n:

### 1. תוכנית הפיתוח
**`CLAUDE_CODE_DEVELOPMENT_PLAN.md`** (באנגלית)
- תוכנית מפורטת ב-10 שלבים לClaude Code
- כל הקוד הדרוש
- הסברים טכניים מלאים
- פאזות עבודה ברורות

### 2. קובץ CLAUDE.md (קריטי!)
**`CLAUDE.md`** - קובץ קונטקסט לClaude Code
- הגדרות סגנון קוד וRTL
- מיקום קבצי Data ו-Schema
- Workflows נפוצים
- פתרונות לבעיות נפוצות

**חשוב מאוד**: העתק את הקובץ הזה לשורש הפרויקט מיד לאחר יצירתו!

### 3. מדריך Skills (חשוב! ⭐)
**`RECOMMENDED_SKILLS.md`** - 6 Skills מומלצים מוכנים
- **Core Development**: frontend-design, react-best-practices, web-design-guidelines
- **Document Generation**: pdf, xlsx
- **Extensibility**: skill-creator

**חשוב**: אתה צריך להתקין את ה-skills האלה ב-Claude Code לפני שמתחילים!

### 4. קבצי Schema ל-n8n
**`n8n_monthly_budget_schema.json`** - Schema לעדכוני תקציב חודשי
**`n8n_savings_schema.json`** - Schema לחשבונות חסכונות

### 3. קבצי דוגמה (Data Examples)
**`monthly_budget_data_example.json`** - דוגמה לנתוני תקציב חודשי (3 חודשים)
**`savings_data_example.json`** - דוגמה לנתוני חסכונות (11 חשבונות)
**`categories_data_example.json`** - רשימת קטגוריות הוצאות והכנסות

### 4. מדריך אינטגרציה
**`n8n_integration_guide.md`** - מדריך מלא לשילוב n8n עם האפליקציה

---

## 🚀 איך להתחיל

### שלב 1: העתק את התוכנית לClaude Code

1. פתח Claude Code
2. העתק את התוכן של `CLAUDE_CODE_DEVELOPMENT_PLAN.md`
3. שלח ל-Claude Code את ההנחיה:

```
Build this family budget management application following this development plan.
Start with Phase 1: Project Setup.

[paste the entire plan here]
```

**חשוב**: לאחר יצירת הפרויקט, העתק את `CLAUDE.md` לשורש הפרויקט. קובץ זה מכיל קונטקסט קריטי שClaude Code צריך כדי לעבוד אפקטיבית.

### שלב 2: Claude Code יבנה את האפליקציה

Claude Code יעבור שלב אחר שלב:
- ✅ Phase 1: הקמת פרויקט Vite + React
- ✅ Phase 2: Context ו-Data Layer
- ✅ Phase 3: Layout Components
- ✅ Phase 4: Summary Cards
- ✅ Phase 5: Monthly Table
- ✅ Phase 6: Charts
- ✅ Phase 7: Savings View
- ✅ Phase 8: Import Feature
- ✅ Phase 9: Integration
- ✅ Phase 10: Polish

### שלב 3: העתק קבצי דוגמה

לאחר שהפרויקט נוצר, העתק את קבצי ה-JSON לתיקייה:
```
family-budget-app/public/data/

העתק לשם:
- monthly_budget_data_example.json → monthly_budget.json
- savings_data_example.json → savings_accounts.json
- categories_data_example.json → categories.json
```

### שלב 4: הרץ את האפליקציה

```bash
cd family-budget-app
npm install
npm run dev
```

פתח בדפדפן: `http://localhost:5173`

### שלב 5: התקן Skills (חובה! ⭐⭐⭐)

לפני שמתחילים לפתח, **חובה** להתקין את ה-6 skills המומלצים.

**למה זה קריטי:**
- Claude Code משתמש ב-skills כדי לעבוד בצורה מקצועית
- בלי skills, הקוד יהיה פחות איכותי
- Skills מבטיחים best practices ב-React, UI/UX, ונגישות

**איך מתקינים:**

פתח את `RECOMMENDED_SKILLS.md` ועקוב אחרי ההוראות להתקנת כל skill.

**רשימת Skills להתקנה:**
```
✅ frontend-design (Anthropic) - עיצוב מקצועי
✅ react-best-practices (Vercel) - אופטימיזציה React (40+ rules)
✅ web-design-guidelines (Vercel) - נגישות ו-UX (100+ rules)
✅ pdf (Anthropic) - ייצוא PDF
✅ xlsx (Anthropic) - עבודה עם Excel
✅ skill-creator (Anthropic) - יצירת skills מותאמים
```

**בדיקה:**
```
You: "List available skills"
Claude: [צריך להציג את כל 6 ה-skills]
```

**שימוש:**

Skills עובדים אוטומטית! Claude יבחר את ה-skill הנכון לכל משימה:

```
אתה: "צור component לכרטיס סיכום חודשי"
Claude: [משתמש ב-react-best-practices + frontend-design]
→ יוצר component מקצועי ומעוצב
```

**יצירת Skills מותאמים:**

אם אתה צריך משהו ספציפי (כמו וולידציה RTL או חישובי תקציב):

```
"/skill-creator
צור skill לוולידציה של RTL בעברית עם דוגמאות ובדיקות"
```

---

## 🔗 אינטגרציה עם n8n

### תהליך עבודה מומלץ

#### תרחיש 1: עיבוד דוח כרטיס אשראי
```
n8n Workflow:
1. קבל PDF של דוח כרטיס אשראי
2. חלץ טקסט (OCR/PDF parser)
3. סווג הוצאות לפי קטגוריות (AI/Rules)
4. צור JSON בפורמט הנדרש
5. שמור לGoogle Drive/Dropbox
```

אתה מוריד את ה-JSON ומייבא לאפליקציה.

#### תרחיש 2: חשבונית מאימייל
```
n8n Workflow:
1. Email trigger (חשבונית חדשה)
2. חלץ PDF מצורף
3. זהה סכום, תאריך, ספק
4. מפה לקטגוריה (energy, insurance, וכו')
5. צור JSON עדכון
6. שמור לתיקייה משותפת
```

### פורמט JSON שn8n צריך לייצר

**עדכון חודש יחיד:**
```json
{
  "month": "2024-04",
  "year": 2024,
  "month_hebrew": "אפר-24",
  "expenses": {
    "variable_expenses": 5247,
    "energy": 450
  },
  "income": {
    "salaries": 20000
  }
}
```

**עדכון מלא (מספר חודשים):**
```json
{
  "months": [
    {
      "month": "2024-01",
      "year": 2024,
      "month_hebrew": "ינו-24",
      "expenses": { ... },
      "income": { ... }
    },
    {
      "month": "2024-02",
      ...
    }
  ],
  "metadata": {
    "last_updated": "2024-04-15T10:00:00Z",
    "source": "n8n_credit_card_processor"
  }
}
```

### איך האפליקציה מטפלת בייבוא?

1. **גרור/שחרר** JSON לאפליקציה
2. האפליקציה **מזהה** אם זה חודש קיים או חדש
3. **ממזגת** את הנתונים:
   - חודש קיים → עדכון ערכים (merge)
   - חודש חדש → הוספה לרשימה
4. **שומרת** את המצב החדש

---

## 📊 מבנה הנתונים

### קובץ: monthly_budget.json
```json
{
  "months": [
    {
      "month": "2024-01",
      "year": 2024,
      "month_hebrew": "ינו-24",
      "expenses": {
        "mortgage": 3000,
        "insurance": 1000,
        "variable_expenses": 5000,
        ...
      },
      "income": {
        "salaries": 20000,
        "child_allowance": 261,
        ...
      }
    }
  ],
  "metadata": {
    "last_updated": "2024-01-31T23:59:59Z",
    "source": "manual",
    "version": "1.0"
  }
}
```

### קובץ: savings_accounts.json
```json
{
  "savings_accounts": [
    {
      "id": "savings_romi_analyst",
      "account_name": "חסכון לכל ילד - רומי (אנליסט)",
      "account_type": "monthly",
      "owner": "הדס",
      "monthly_amount": 102,
      "yearly_amount": 1224,
      "accumulated": 18121
    }
  ]
}
```

### קובץ: categories.json
```json
{
  "categories": [
    {
      "id": "mortgage",
      "name_hebrew": "משכנתא",
      "type": "expense",
      "is_fixed": true,
      "is_active": true
    }
  ]
}
```

---

## 🎨 העיצוב שקיבלת

האפליקציה בנויה על העיצוב ה-HTML שהעלית:
- ✅ 4 כרטיסי סיכום למעלה
- ✅ טבלה גדולה עם גלילה אופקית
- ✅ 2 גרפים (קו ועמודות)
- ✅ תמיכה ב-RTL מלאה
- ✅ Tailwind CSS
- ✅ Material Icons

---

## 🛠 טכנולוגיות

- **Frontend:** Vite + React
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Material Symbols
- **Storage:** JSON files (local)
- **RTL:** Native Hebrew support

---

## ✨ פיצ'רים ב-MVP

### מה כלול:
✅ תצוגת דשבורד עם סיכומים
✅ טבלה חודשית ניתנת לעריכה
✅ גרפי מגמות
✅ תצוגת חסכונות
✅ ייבוא JSON מ-n8n
✅ מיזוג אוטומטי של נתונים
✅ תמיכה בעברית מלאה

### מה אפשר להוסיף בעתיד:
- ניהול קטגוריות מהממשק
- ייצוא PDF
- חיפוש ופילטרים
- תחזיות ותקציבים
- sync אוטומטי עם n8n

---

## 💡 טיפים חשובים

### לפיתוח:
1. **התחל פשוט** - בנה component אחד בכל פעם
2. **בדוק עם דאטה אמיתית** - השתמש בקבצי הדוגמה
3. **RTL מיד מההתחלה** - תבדוק שהעברית עובדת טוב
4. **State ב-Context** - אל תעביר props עמוק

### ל-n8n:
1. **פורמט פשוט** - n8n רק צריך לייצר JSON
2. **וולידציה** - וודא שהערכים חיוביים ו-dates תקינים
3. **Merge בטוח** - האפליקציה לא תמחק דאטה קיים
4. **גרסה 1** - התחל עם ייבוא ידני, אוטומציה אחר כך

---

## 📖 קריאה נוספת

- **תוכנית הפיתוח:** `CLAUDE_CODE_DEVELOPMENT_PLAN.md`
- **מדריך n8n:** `n8n_integration_guide.md`
- **Schema files:** לvalidation וdocumentation

---

## 🎯 סיכום

**יש לך הכל מה שצריך:**
1. תוכנית פיתוח מלאה לClaude Code ✅
2. קובץ CLAUDE.md לקונטקסט אופטימלי ✅
3. מדריך Skills עם 6 skills חיוניים ✅
4. קבצי Schema ל-n8n ✅
5. דוגמאות נתונים ✅
6. מדריך אינטגרציה ✅

**הצעד הבא:**
1. **התקן את ה-6 Skills** - זה הכי חשוב! ⚠️
2. פתח Claude Code 
3. העתק את CLAUDE.md לשורש הפרויקט
4. התחל לבנות! 🚀

**טיפ מקצוען:** Skills הם הסוד - בלעדיהם Claude Code לא יעבוד באופטימום!

---

**יש שאלות?**
כל הקבצים מתועדים ומוסברים. תוכל תמיד לחזור למדריכים.

בהצלחה! 💪
