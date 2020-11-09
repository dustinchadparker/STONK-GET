import * as React from "react";
import "../../scss/app";

export default class BlogPreviewCard extends React.Component<
  IBlogPreviewCardProps,
  IBlogPreviewCardState
> {
  render() {
    const { closePrice, highPrice, tag, date, index} = this.props;

    return (
      <div className="input-group mb-1 justify-content: space-between">
        <span className="input-group-text col-1 text-white bg-dark">{tag}</span>
        <span className="input-group-text col-1">{closePrice}</span>

        <span className="input-group-text col-8 text-white bg-dark">
          {highPrice}
        </span>
        <span className="input-group-text col-2 text-white bg-dark">
          {date} 
        </span>
      </div>
    );
  }
}

interface IBlogPreviewCardProps {
  closePrice: string;
  highPrice: string;
  tag: string;
  date: string;
  index: number;
}

interface IBlogPreviewCardState {}
