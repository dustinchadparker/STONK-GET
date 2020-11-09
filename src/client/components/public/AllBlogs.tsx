import * as React from "react";
import BlogPreviewCard from "./BlogPreviewCard";
import "../../scss/app";

export default class Alldata extends React.Component<
  IAlldataProps,
  IAlldataState
  > {
  constructor(props: IAlldataProps) {
    super(props);
    this.state = {
      items: [],

    };
  }

  async componentDidMount() { }

  onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(
      `/pupRouter/`
    )
      .then(response => response.json())
      .then(data => {
        const items = data.index.map((_index: any, index: number) => ({
          closePrice: data.closePrice[index],
          highPrice: data.highPrice[index],
          tag: data.tag[index],
          date: data.date[index],
        }));

        this.setState({ items });
      }).catch(function (e) {
        console.log(e);
      });
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-center text-white">Stock Miner</h1>
        <form
          className="form-group mt-5 border border-primary rounded p-3 shadow-lg bg-info"
          onSubmit={this.onSubmit}
        >

          <button className="btn btn-secondary mt-2 shadow">Go Mining!</button>
        </form>
        <div className="input-group mb-1 justify-content: space-between">
          <span className="input-group-text col-1 text-white bg-dark">Tag</span>
          <span className="input-group-text col-1 text-white bg-dark">
            Date{" "}
          </span>

          <span className="input-group-text col-8 text-white bg-dark">
            Lowest Price{" "}
          </span>
          <span className="input-group-text col-2 text-white bg-dark">
            Highest Price{" "}
          </span>
        </div>

        {this.state.items.map((item: Item, index: number) => {
          return (
            <BlogPreviewCard
              index={index}
              closePrice={item.closePrice}
              highPrice={item.highPrice}
              tag={item.tag}
              date={item.date}
            />
          );
        })}
      </main>
    );
  }
}

interface IAlldataProps { }

interface IAlldataState {
  items: Item[];
}

interface Item {
  closePrice: string;
  highPrice: string;
  tag: string;
  date: string;
}
