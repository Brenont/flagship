import React, { Component, RefObject } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import { memoize } from 'lodash-es';
import { defaultTextboxStyle, getColor } from './formStyles';
import { FormLabelPosition } from './fieldTemplates';

import successIcon from '../../../../assets/images/checkmarkValidation.png';
import errorIcon from '../../../../assets/images/alert.png';

export interface StatefulTextboxProps {
  labelPosition: FormLabelPosition;
  locals: Record<string, any>;
  // for use w/ custom field templates
  componentFactory?: any;
}

export interface StatefulTextboxState {
  active: boolean;
  validated: boolean;
}

export type ComputeFieldType = (prevField: any) => () => void;

export default class StatefulTextbox extends Component<StatefulTextboxProps, StatefulTextboxState> {
  activeErrorField: JSX.Element;
  alertStyle: Record<string, any>;
  checkStyle: Record<string, any>;
  controlLabelStyle: Record<string, any>;
  defaultStyle: Record<string, any>;
  errorBlockStyle: Record<string, any>;
  groupStyle: Record<string, any>;
  help: JSX.Element;
  labelViewStyle: Record<string, any>;
  rightTextboxIconStyle: Record<string, any>;
  textboxStyle: Record<string, any>;
  textboxViewStyle: Record<string, any>;

  state: StatefulTextboxState = {
    active: false,
    validated: false,
  };

  // memoizes returned function so as not to recompute on each rerender
  private computeBlur: ComputeFieldType = memoize((prevOnBlur) => () => {
    this.onBlur();

    if (typeof prevOnBlur === 'function') {
      prevOnBlur();
    }
  });

  private computeFocus: ComputeFieldType = memoize((prevOnFocus) => () => {
    this.onFocus();

    if (typeof prevOnFocus === 'function') {
      prevOnFocus();
    }
  });

  private input: RefObject<TextInput>;

  constructor(props: StatefulTextboxProps) {
    super(props);

    this.input = React.createRef<TextInput>();

    this.defaultStyle = defaultTextboxStyle(props.locals);

    this.activeErrorField = this.defaultStyle.activeErrorField;
    this.alertStyle = this.defaultStyle.alertStyle;
    this.checkStyle = this.defaultStyle.checkStyle;
    this.controlLabelStyle = this.defaultStyle.controlLabelStyle;
    this.errorBlockStyle = this.defaultStyle.errorBlockStyle;
    this.help = this.defaultStyle.help;
    this.rightTextboxIconStyle = this.defaultStyle.rightTextboxIconStyle;
    this.textboxViewStyle = this.defaultStyle.textboxViewStyle;

    switch (props.labelPosition) {
      case FormLabelPosition.Inline:
        this.groupStyle = this.defaultStyle.inlineFormGroupStyle;
        this.textboxStyle = this.defaultStyle.textboxInlineStyle;
        this.labelViewStyle = this.defaultStyle.inlineLabelViewStyle;
        break;
      case FormLabelPosition.Above:
        this.groupStyle = this.defaultStyle.formGroupStyle;
        this.textboxStyle = this.defaultStyle.textboxFullBorderStyle;
        this.labelViewStyle = this.defaultStyle.inlineLabelViewStyle;
        break;
      case FormLabelPosition.Floating:
        this.groupStyle = this.defaultStyle.formGroupStyle;
        this.textboxStyle = this.defaultStyle.textboxUnderlineStyle;
        this.labelViewStyle = this.defaultStyle.floatingLabelViewStyle;
        break;
      case FormLabelPosition.Hidden:
        this.groupStyle = this.defaultStyle.formGroupStyle;
        this.textboxStyle = this.defaultStyle.textboxFullBorderStyle;
        this.labelViewStyle = { display: 'none' };
        break;
      default:
        this.groupStyle = this.defaultStyle.inlineFormGroupStyle;
        this.textboxStyle = this.defaultStyle.textboxInlineStyle;
        this.labelViewStyle = this.defaultStyle.inlineLabelViewStyle;
    }
  }

  componentDidMount(): void {
    console.warn(
      'StatefulTextbox is deprecated and will be removed in the next version of Flagship.'
    );
  }

  // eslint-disable-next-line complexity
  render(): JSX.Element {
    const { locals, componentFactory, labelPosition } = this.props;

    const prevOnBlur = locals.onBlur;
    const prevOnFocus = locals.onFocus;

    locals.onBlur = this.computeBlur(prevOnBlur);
    locals.onFocus = this.computeFocus(prevOnFocus);

    const color = getColor(this.state, locals);

    let label: JSX.Element;
    let error: JSX.Element;

    // eslint-disable-next-line prefer-const
    error = locals.error ? (
      <Text accessibilityLiveRegion="polite" style={this.errorBlockStyle}>
        {locals.error}
      </Text>
    ) : (
      this.activeErrorField
    );

    if (labelPosition === FormLabelPosition.Inline) {
      locals.placeholder = this.state.active ? null : locals.error;
      locals.placeholderTextColor = locals.stylesheet.colors.error;
    }

    if (labelPosition === FormLabelPosition.Floating) {
      label = locals.value ? (
        <Text style={[this.controlLabelStyle, { color }]}>{locals.label}</Text>
      ) : (
        <Text style={this.controlLabelStyle}>&nbsp;</Text>
      );
    } else {
      label = <Text style={[this.controlLabelStyle, { color }]}>{locals.label}</Text>;
    }

    if (labelPosition === FormLabelPosition.Above) {
      locals.placeholder = '';
    }

    const getIcon = () => {
      return this.props.locals.hasError ? (
        <Image source={errorIcon} style={this.alertStyle} />
      ) : (
        <Image source={successIcon} style={this.checkStyle} />
      );
    };

    return (
      <View>
        <View style={[this.groupStyle, { borderColor: color }]}>
          <View style={this.labelViewStyle}>{label}</View>
          <View style={this.textboxViewStyle}>
            {componentFactory instanceof Function ? (
              componentFactory(locals, this.textboxStyle, color)
            ) : (
              <TextInput
                accessibilityLabel={locals.label}
                ref={this.input}
                onChangeText={locals.onChange}
                onChange={locals.onChangeNative}
                style={[this.textboxStyle, { borderColor: color }]}
                {...locals}
              />
            )}
            <View style={this.rightTextboxIconStyle}>
              {this.state.validated ? getIcon() : null}
            </View>
          </View>
          {labelPosition !== FormLabelPosition.Inline
            ? this.state.active
              ? this.activeErrorField
              : error
            : null}
        </View>
        <View>{this.help}</View>
      </View>
    );
  }

  private onFocus = () => {
    this.setState({
      active: true,
      validated: false,
    });
  };

  private onBlur = () => {
    this.setState({
      active: false,
      validated: true,
    });
  };
}
