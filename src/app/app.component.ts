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

  constructor(private apollo: Apollo) {
    this.get(1);
  }

  get(channelId: number) {
    const today = moment().format('YYYY-MM-DD');
    this.loading = true;
    this.list = this.apollo.watchQuery<any>({
      query: gql`
      {
        slotsRange(channelId: ${channelId}, startDate: "${today}", endDate: "${today}") {
          publishingName,
          scheduledDate,
          event {
            duration,
            synopsis
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
    this.get(event.target.value);
  }
}
