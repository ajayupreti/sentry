import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import {t} from 'app/locale';
import Tooltip from 'app/components/tooltip';

const Redaction = styled.span`
  background: rgba(255, 0, 0, 0.05);
  cursor: pointer;
`;

class AnnotatedText extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    meta: PropTypes.object,
    renderWith: PropTypes.func,
  };

  static defaultProps = {
    renderWith: text => text,
  };

  renderChunk(chunk) {
    let content = this.props.renderWith(chunk.text);

    if (chunk.type === 'redaction') {
      let title = t('Redacted PII (rule "%s")', chunk.rule_id);
      return (
        <Tooltip title={title}>
          <Redaction>{content}</Redaction>
        </Tooltip>
      );
    }

    return content;
  }

  render() {
    // TODO(ja): Context!
    let {text, meta, renderWith} = this.props;
    let chunks = meta && meta.chunks;
    if (!text || !chunks || !chunks.length) {
      return renderWith(text);
    }

    return (
      <span>
        {chunks.map((chunk, key) => React.cloneElement(this.renderChunk(chunk), {key}))}
      </span>
    );
  }
}

export default AnnotatedText;