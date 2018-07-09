import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from '../../node_modules/apollo-client/util/Observable';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  loading: boolean;
  list: Subscription;
  channelName: string;
  today: string;
  day: string;
  channelId: number;

  constructor(private apollo: Apollo) {
    this.get(1);
    this.day = moment().format('YYYY-MM-DD');
    this.today = this.day;
  }

  get(channelId: number) {
    this.channelId = channelId;
    this.loading = true;
    console.log(this.day);
    this.list = this.apollo.watchQuery<any>({
      query: gql`
      {
        slotsRange(channelId: ${this.channelId}, startDate: "${this.day}", endDate: "${this.day}") {
          publishingName,
          scheduledDate,
          event {
            duration
          },
          title {
            rating,
            synopsis,
            seasonNumber,
            episodeNumber
          },
          channel {
            name
          }
        }
      }
    `
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.list = data.slotsRange;
        this.channelName = data.slotsRange[0].channel.name;
      });
  }

  update(event) {
    this.channelId = event.target.value;
    this.get(this.channelId);
  }

  onDateSelect(event) {
    this.day = `${event.year}-${event.month < 10 ? '0' + event.month : event.month }-${event.day < 10 ? '0' + event.day : event.day}`;
    this.get(this.channelId);
  }
}
