class StateMachine {
  constructor() {
    this.currentState = null;
    this.transitions = new WeakMap();
    this.anyTransitions = [];
  }

  setState(state) {
    if (this.currentState === state) {
      return;
    }

    if (this.currentState) {
      this.currentState.onExit();
    }

    this.currentState = state;
    this.currentState.onEnter();
  }

  tick() {
    if (!this.currentState) {
      return;
    }

    const anyTransition = this.anyTransitions.find((t) => t.predicate());
    if (anyTransition) {
      this.setState(anyTransition.to);
    }

    if (this.transitions.has(this.currentState)) {
      const stateTransition = this.transitions
        .get(this.currentState)
        .find((t) => t.predicate());

      if (stateTransition) {
        this.setState(stateTransition.to);
      }
    }

    this.currentState.tick();
  }

  addTransition(from, to, predicate) {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, []);
    }

    this.transitions.get(from).push({ to, predicate });
  }

  addAnyTransition(to, predicate) {
    this.anyTransitions.push({ to, predicate });
  }
}

export default StateMachine;

