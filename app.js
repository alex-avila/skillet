const data = {
  isPlaying: false,
  monsterHealth: 100,
  playerHealth: 100,
  specialAttackNum: 3,
  stamina: 3
};

const vm = new Vue({
  el: "#app",
  data: { ...data, actions: [] },
  computed: {
    isSpecialAttackActive: function() {
      return this.specialAttackNum > 0;
    },
    specialAttackClasses: function() {
      return ["orange-button", { disabled: !this.isSpecialAttackActive }];
    },
    playerHealthBar: function() {
      return { width: `${this.playerHealth}%` };
    },
    monsterHealthBar: function() {
      return { width: `${this.monsterHealth}%` };
    }
  },
  watch: {
    playerHealth: function() {
      if (this.playerHealth <= 0) {
        if (confirm("You won. Play again?")) {
          this.reset();
          this.isPlaying = true;
        } else {
          this.reset();
        }
      }
    },
    monsterHealth: function() {
      if (this.monsterHealth <= 0) {
        if (confirm("You lost :(. Play again?")) {
          this.reset();
          this.isPlaying = true;
        } else {
          this.reset();
        }
      }
    }
  },
  methods: {
    start: function() {
      this.isPlaying = true;
    },
    attack: function() {
      const monsterDamage = this.calculateDamage(1, 15);
      const yourDamange = this.calculateDamage(1, 15);

      this.monsterHealth -= monsterDamage;
      this.playerHealth -= yourDamange;

      this.stamina++;
      if (this.stamina === 3) this.specialAttackNum = 3;

      this.addActions(
        `Player hits monster for ${monsterDamage}`,
        `Monster hits player for ${yourDamange}`
      );
    },
    specialAttack: function(enabled) {
      let monsterDamage, yourDamange;
      if (enabled && this.stamina) {
        monsterDamage = this.calculateDamage(5, 20);
        yourDamange = this.calculateDamage(1, 15);

        this.monsterHealth -= monsterDamage;
        this.playerHealth -= yourDamange;

        this.specialAttackNum--;
        this.stamina--;

        this.addActions(
          `Player hits monster for ${monsterDamage}`,
          `Monster hits player for ${yourDamange}`
        );
      }
    },
    heal: function() {
      const yourHealing = this.calculateDamage(1, 15);
      const yourDamange = this.calculateDamage(1, 15);

      this.playerHealth -= yourDamange;
      this.playerHealth += yourHealing;

      this.addActions(
        `Player heals for ${yourHealing}`,
        `Monster hits player for ${yourDamange}`
      );
    },
    reset: function() {
      Object.keys(data).forEach(key => (this[key] = data[key]));
      this.actions = [];
    },
    calculateDamage: function(min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    addActions: function(playerMsg, monsterMsg) {
      this.actions.unshift(
        {
          class: "your-action-text",
          message: playerMsg
        },
        {
          class: "monster-action-text",
          message: monsterMsg
        }
      );
    }
  }
});
