import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';
import { PasswordGenerator, Tooltip } from 'components';
import { generator } from 'common/utils/password';

const DEFAULT_LENGTH = 16;

class TooltipPasswordGenerator extends Component {
  state = this.prepareInitialState();

  // eslint-disable-next-line
  handleClickOutside() {
    const { onToggleVisibility = Function.prototype } = this.props;

    onToggleVisibility();
  }

  getLengthValue(event) {
    return event.target.value.toValue;
  }

  getOptionValue(optionType) {
    const { [optionType]: value } = this.state;

    return !value;
  }

  handleGeneratePassword = () => {
    const { onGeneratePassword } = this.props;
    const { length, digits, specials } = this.state;

    onGeneratePassword(generator(length, { digits, specials }));
  };

  handleChangeOption = optionType => event => {
    const value =
      optionType === 'length'
        ? this.getLengthValue(event)
        : this.getOptionValue(optionType);

    this.setState(
      {
        [optionType]: value,
      },
      this.handleGeneratePassword,
    );
  };

  prepareInitialState() {
    return {
      length: DEFAULT_LENGTH,
      digits: true,
      specials: true,
    };
  }

  render() {
    const { length, digits, specials } = this.state;
    const { isVisible } = this.props;

    return (
      <Tooltip
        show={isVisible}
        arrowAlign="center"
        position="bottom center"
        textBoxWidth="300px"
        padding="0px 30px 10px 30px"
      >
        <PasswordGenerator
          length={length}
          digits={digits}
          specials={specials}
          onChangeOption={this.handleChangeOption}
        />
      </Tooltip>
    );
  }
}

export default enhanceWithClickOutside(TooltipPasswordGenerator);
